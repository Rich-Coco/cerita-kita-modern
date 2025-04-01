import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Access environment variables for Midtrans keys
    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY") || "";
    const MIDTRANS_CLIENT_KEY = Deno.env.get("MIDTRANS_CLIENT_KEY") || "";
    const MIDTRANS_MERCHANT_ID = Deno.env.get("MIDTRANS_MERCHANT_ID") || "";
    
    console.log("Midtrans Server Key available:", MIDTRANS_SERVER_KEY ? "Yes" : "No");
    console.log("Midtrans Client Key available:", MIDTRANS_CLIENT_KEY ? "Yes" : "No");
    console.log("Midtrans Merchant ID available:", MIDTRANS_MERCHANT_ID ? "Yes" : "No");
    
    if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY || !MIDTRANS_MERCHANT_ID) {
      console.error("Missing Midtrans API keys");
      return new Response(
        JSON.stringify({ error: "Missing Midtrans API keys, please check your Supabase secrets configuration" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Parse the request body as JSON
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { action, payload } = body;
    console.log(`Processing ${action} request with payload:`, JSON.stringify(payload));

    // Create payment session for Midtrans
    if (action === "create_payment") {
      const { userId, packageId, amount, coins, name, email } = payload;
      
      if (!userId || !packageId || !amount || !coins || !name || !email) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Generate unique order ID with timestamp
      const timestamp = new Date().getTime();
      const orderId = `HUNT-${packageId}-${timestamp}`;
      
      console.log(`Creating transaction record for order: ${orderId}`);
      
      // Create transaction record in database
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          amount: amount,
          coins: coins,
          status: "pending",
          midtrans_order_id: orderId
        })
        .select()
        .single();
      
      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        return new Response(
          JSON.stringify({ error: "Failed to create transaction", details: transactionError }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Create Midtrans Snap token
      const midtransBaseUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions"; // Use "https://app.midtrans.com/snap/v1/transactions" for production
      const authToken = btoa(`${MIDTRANS_SERVER_KEY}:`);
      
      console.log(`Calling Midtrans API for order: ${orderId}`);
      console.log(`Using auth token created with server key: ${MIDTRANS_SERVER_KEY.substring(0, 10)}...`);
      
      const midtransPayload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: name,
          email: email
        },
        item_details: [{
          id: packageId,
          price: amount,
          quantity: 1,
          name: `${coins} Koin Hunt`
        }]
      };
      
      console.log("Midtrans request payload:", JSON.stringify(midtransPayload));
      
      try {
        const midtransResponse = await fetch(midtransBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${authToken}`
          },
          body: JSON.stringify(midtransPayload)
        });
        
        const responseText = await midtransResponse.text();
        console.log("Midtrans raw response:", responseText);
        
        if (!midtransResponse.ok) {
          console.error("Midtrans API error response status:", midtransResponse.status);
          
          // Update transaction status to failed
          await supabase
            .from("transactions")
            .update({ status: "failed" })
            .eq("id", transaction.id);
          
          return new Response(
            JSON.stringify({ 
              error: "Failed to create payment token", 
              status: midtransResponse.status,
              details: responseText
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        let midtransData;
        try {
          midtransData = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse Midtrans response:", e);
          return new Response(
            JSON.stringify({ 
              error: "Invalid response from Midtrans", 
              details: responseText
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        console.log(`Successfully created Midtrans token for order: ${orderId}`, midtransData);
        
        return new Response(
          JSON.stringify({ 
            token: midtransData.token,
            redirect_url: midtransData.redirect_url,
            transaction_id: transaction.id,
            order_id: orderId,
            client_key: MIDTRANS_CLIENT_KEY
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error calling Midtrans API:", error);
        
        // Update transaction status to failed
        await supabase
          .from("transactions")
          .update({ status: "failed" })
          .eq("id", transaction.id);
        
        return new Response(
          JSON.stringify({ error: "Failed to connect to Midtrans API", details: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }
    
    // Handle Midtrans webhook notifications
    if (action === "notification") {
      const { order_id, transaction_id, transaction_status, payment_type, fraud_status } = payload;
      
      if (!order_id) {
        return new Response(
          JSON.stringify({ error: "Invalid notification payload" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Get transaction from database
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("midtrans_order_id", order_id)
        .single();
      
      if (transactionError || !transaction) {
        console.error("Error finding transaction:", transactionError);
        return new Response(
          JSON.stringify({ error: "Transaction not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      // Determine transaction status
      let status = "pending";
      
      if (transaction_status === "capture" || transaction_status === "settlement") {
        if (fraud_status === "accept" || fraud_status === undefined) {
          status = "success";
        }
      } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
        status = "failed";
      }
      
      // Update transaction in database
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: status,
          midtrans_transaction_id: transaction_id,
          payment_type: payment_type
        })
        .eq("id", transaction.id);
      
      if (updateError) {
        console.error("Error updating transaction:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update transaction" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      // If payment is successful, update user's coin balance
      if (status === "success") {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("coins")
          .eq("id", transaction.user_id)
          .single();
        
        if (profileError || !profile) {
          console.error("Error finding user profile:", profileError);
          return new Response(
            JSON.stringify({ error: "User profile not found" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
          );
        }
        
        // Update user's coin balance
        const newCoins = (profile.coins || 0) + transaction.coins;
        
        const { error: coinUpdateError } = await supabase
          .from("profiles")
          .update({ coins: newCoins })
          .eq("id", transaction.user_id);
        
        if (coinUpdateError) {
          console.error("Error updating user's coins:", coinUpdateError);
          return new Response(
            JSON.stringify({ error: "Failed to update user's coins" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle transaction status check
    if (action === "check_status") {
      const { transaction_id } = payload;
      
      if (!transaction_id) {
        return new Response(
          JSON.stringify({ error: "Missing transaction ID" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Get transaction from database
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transaction_id)
        .single();
      
      if (transactionError || !transaction) {
        console.error("Error finding transaction:", transactionError);
        return new Response(
          JSON.stringify({ error: "Transaction not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      // Manual check with Midtrans if status is still pending
      if (transaction.status === "pending" && transaction.midtrans_order_id) {
        const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/${transaction.midtrans_order_id}/status`;
        const authToken = btoa(`${MIDTRANS_SERVER_KEY}:`);
        
        try {
          const response = await fetch(midtransStatusUrl, {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Basic ${authToken}`
            }
          });
          
          if (response.ok) {
            const midtransStatus = await response.json();
            console.log("Midtrans status check response:", midtransStatus);
            
            // Update transaction status based on Midtrans response
            let newStatus = transaction.status;
            
            if (midtransStatus.transaction_status === "capture" || 
                midtransStatus.transaction_status === "settlement") {
              if (midtransStatus.fraud_status === "accept" || !midtransStatus.fraud_status) {
                newStatus = "success";
              }
            } else if (midtransStatus.transaction_status === "deny" || 
                      midtransStatus.transaction_status === "cancel" || 
                      midtransStatus.transaction_status === "expire") {
              newStatus = "failed";
            }
            
            // Update transaction if status changed
            if (newStatus !== transaction.status) {
              const { error: updateError } = await supabase
                .from("transactions")
                .update({
                  status: newStatus,
                  payment_type: midtransStatus.payment_type,
                  midtrans_transaction_id: midtransStatus.transaction_id
                })
                .eq("id", transaction.id);
              
              if (updateError) {
                console.error("Error updating transaction status:", updateError);
              } else {
                // If payment successful, update user coins
                if (newStatus === "success") {
                  const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("coins")
                    .eq("id", transaction.user_id)
                    .single();
                  
                  if (!profileError && profile) {
                    const newCoins = (profile.coins || 0) + transaction.coins;
                    
                    await supabase
                      .from("profiles")
                      .update({ coins: newCoins })
                      .eq("id", transaction.user_id);
                  }
                }
                
                // Return updated status
                transaction.status = newStatus;
              }
            }
          }
        } catch (error) {
          console.error("Error checking Midtrans status:", error);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          status: transaction.status,
          order_id: transaction.midtrans_order_id,
          amount: transaction.amount,
          coins: transaction.coins,
          payment_type: transaction.payment_type,
          created_at: transaction.created_at
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
