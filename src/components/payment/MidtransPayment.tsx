import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PackageType } from '@/types/payment';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

interface MidtransPaymentProps {
  packageData: PackageType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const MidtransPayment = ({ packageData, onSuccess, onError }: MidtransPaymentProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const loadMidtransScript = (clientKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://app.sandbox.midtrans.com/snap/snap.js`;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Midtrans script'));
      
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async () => {
    if (!user || !profile) {
      toast({
        title: "Tidak dapat memproses pembayaran",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const payload = {
        userId: user.id,
        packageId: packageData.id,
        amount: packageData.priceValue,
        coins: packageData.coins,
        name: profile.full_name || user.email,
        email: user.email
      };
      
      console.log("Sending payment request with payload:", payload);
      
      const { data, error } = await supabase.functions.invoke("midtrans", {
        body: {
          action: "create_payment",
          payload
        }
      });
      
      if (error) {
        console.error("Error creating payment:", error);
        toast({
          title: "Gagal membuat pembayaran",
          description: "Terjadi kesalahan saat memproses pembayaran Anda. Silakan coba lagi.",
          variant: "destructive"
        });
        if (onError) onError(error.message);
        setIsLoading(false);
        return;
      }
      
      console.log("Payment creation response:", data);
      
      if (!data || !data.token) {
        const errorMsg = data?.error || "Invalid response from payment service";
        console.error("Invalid response from payment service:", data);
        toast({
          title: "Gagal membuat pembayaran",
          description: `${data?.error || "Respons dari layanan pembayaran tidak valid"}. Silakan coba lagi.`,
          variant: "destructive"
        });
        if (onError) onError(errorMsg);
        setIsLoading(false);
        return;
      }
      
      try {
        await loadMidtransScript(data.client_key);
      } catch (error) {
        console.error("Failed to load Midtrans script:", error);
        toast({
          title: "Gagal memuat skrip pembayaran",
          description: "Terjadi kesalahan saat memuat skrip Midtrans. Silakan coba lagi.",
          variant: "destructive"
        });
        if (onError) onError("Failed to load payment script");
        setIsLoading(false);
        return;
      }
      
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => {
            toast({
              title: "Pembayaran berhasil",
              description: `${packageData.coins} koin telah ditambahkan ke akun Anda`
            });
            checkTransactionStatus(data.transaction_id);
            if (onSuccess) onSuccess();
            
            navigate('/coins');
          },
          onPending: () => {
            toast({
              title: "Pembayaran tertunda",
              description: "Pembayaran Anda sedang diproses"
            });
            checkTransactionStatus(data.transaction_id);
          },
          onError: (error: any) => {
            console.error("Midtrans payment error:", error);
            toast({
              title: "Pembayaran gagal",
              description: "Terjadi kesalahan saat memproses pembayaran Anda",
              variant: "destructive"
            });
            if (onError) onError("Payment failed");
            setIsLoading(false);
          },
          onClose: () => {
            toast({
              title: "Pembayaran dibatalkan",
              description: "Anda telah menutup halaman pembayaran"
            });
            checkTransactionStatus(data.transaction_id);
            setIsLoading(false);
          }
        });
      } else {
        console.error("Midtrans Snap not loaded properly");
        toast({
          title: "Gagal memuat pembayaran",
          description: "Tidak dapat memuat sistem pembayaran. Silakan coba lagi.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Gagal memproses pembayaran",
        description: "Terjadi kesalahan saat memproses pembayaran Anda. Silakan coba lagi.",
        variant: "destructive"
      });
      if (onError) onError(error.message);
      setIsLoading(false);
    }
  };
  
  const checkTransactionStatus = async (transactionId: string) => {
    try {
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data, error } = await supabase.functions.invoke("midtrans", {
          body: {
            action: "check_status",
            payload: { transaction_id: transactionId }
          }
        });
        
        if (error) {
          console.error("Error checking transaction status:", error);
          continue;
        }
        
        console.log("Transaction status check response:", data);
        
        if (data.status === "success") {
          toast({
            title: "Pembayaran berhasil!",
            description: `${packageData.coins} koin telah ditambahkan ke akun Anda`,
          });
          if (onSuccess) onSuccess();
          setIsLoading(false);
          
          navigate('/coins');
          return;
        } else if (data.status === "failed") {
          toast({
            title: "Pembayaran gagal",
            description: "Pembayaran Anda tidak berhasil",
            variant: "destructive"
          });
          if (onError) onError("Payment failed");
          setIsLoading(false);
          return;
        }
      }
      
      toast({
        title: "Status pembayaran",
        description: "Pembayaran masih diproses. Koin akan ditambahkan otomatis setelah pembayaran selesai."
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking transaction status:", error);
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handlePayment} 
      className="w-full"
      variant={packageData.popular ? 'default' : 'outline'}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Memproses...
        </>
      ) : (
        <>
          <CreditCard size={16} className="mr-2" />
          Beli Sekarang
        </>
      )}
    </Button>
  );
};

export default MidtransPayment;
