
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
    // Access environment variables for Midtrans keys - these are set in config.toml
    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
    const MIDTRANS_CLIENT_KEY = Deno.env.get("MIDTRANS_CLIENT_KEY");
    
    if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
      console.error("Missing Midtrans API keys");
      return new Response(
        JSON.stringify({ error: "Missing Midtrans API keys" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { action, payload } = await req.json();
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
      
      const midtransResponse = await fetch(midtransBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Basic ${authToken}`
        },
        body: JSON.stringify({
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
        })
      });
      
      const midtransData = await midtransResponse.json();
      
      if (!midtransResponse.ok) {
        console.error("Midtrans API error:", midtransData);
        console.error("Response status:", midtransResponse.status);
        
        // Update transaction status to failed
        await supabase
          .from("transactions")
          .update({ status: "failed" })
          .eq("id", transaction.id);
        
        return new Response(
          JSON.stringify({ 
            error: "Failed to create payment token", 
            midtransError: midtransData,
            status: midtransResponse.status 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log(`Successfully created Midtrans token for order: ${orderId}`);
      
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
      
      return new Response(
        JSON.stringify({ 
          status: transaction.status,
          order_id: transaction.midtrans_order_id,
          amount: transaction.amount,
          coins: transaction.coins,
          payment_type: transaction.payment_type
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
