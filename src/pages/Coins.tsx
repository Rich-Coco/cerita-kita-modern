import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins as CoinsIcon, CreditCard, Check, Gem, Sparkles, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import MidtransPayment from '@/components/payment/MidtransPayment';
import TransactionHistory from '@/components/payment/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageType } from '@/types/payment';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Coins } from '@/components/ui/coins';
const coinPackages: PackageType[] = [{
  id: 'basic',
  name: 'Paket Dasar',
  coins: 10,
  price: 'Rp 10.000',
  priceValue: 10000,
  features: ['Akses ke 1-10 chapter premium', 'Berlaku selamanya', 'Tidak ada batasan waktu'],
  popular: false,
  paymentLink: 'https://app.midtrans.com/payment-links/1743663616326'
}, {
  id: 'premium',
  name: 'Paket Premium',
  coins: 30,
  price: 'Rp 30.000',
  priceValue: 30000,
  features: ['Akses ke 10-30 chapter premium', 'Diskon 15% dari harga per koin', 'Hadiah bonus badge profil', 'Berlaku selamanya'],
  popular: true,
  paymentLink: 'https://app.midtrans.com/payment-links/1743663811172'
}, {
  id: 'ultimate',
  name: 'Paket Ultimate',
  coins: 50,
  price: 'Rp 50.000',
  priceValue: 50000,
  features: ['Akses ke 20-50 chapter premium', 'Diskon 30% dari harga per koin', 'Hadiah bonus badge profil eksklusif', 'Fitur highlight komentar', 'Berlaku selamanya'],
  popular: false,
  paymentLink: 'https://app.midtrans.com/payment-links/1743663886817'
}];
const CoinsPage = () => {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('packages');
  useEffect(() => {
    const handleDirectPaymentCallback = async () => {
      if (!user) return;
      const url = new URL(window.location.href);
      const orderId = url.searchParams.get('order_id');
      const status = url.searchParams.get('transaction_status');
      const source = url.searchParams.get('source');
      if (orderId && status === 'settlement' && source === 'midtrans') {
        try {
          console.log('Processing direct payment callback:', orderId);
          const {
            data,
            error
          } = await supabase.functions.invoke("midtrans", {
            body: {
              action: "direct_payment_callback",
              payload: {
                order_id: orderId,
                user_id: user.id
              }
            }
          });
          if (error) {
            console.error('Error processing direct payment:', error);
            toast({
              title: 'Pembayaran gagal diproses',
              description: 'Terjadi kesalahan saat memproses pembayaran Anda',
              variant: 'destructive'
            });
            return;
          }
          if (data.success) {
            toast({
              title: 'Pembayaran berhasil!',
              description: `${data.coins_added || 10} koin telah ditambahkan ke akun Anda`
            });
            window.history.replaceState({}, document.title, window.location.pathname);

            // Refresh the page to update the UI with new coin balance
            window.location.reload();
          } else if (data.status === 'exists') {
            toast({
              title: 'Pembayaran sudah diproses',
              description: 'Pembayaran ini sudah pernah diproses sebelumnya'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Error handling direct payment callback:', error);
        }
      }
    };
    handleDirectPaymentCallback();
  }, [user]);
  const handlePaymentSuccess = () => {
    window.location.reload();
  };
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };
  const handleDirectPaymentRedirect = (paymentLink: string) => {
    try {
      console.log('Starting direct payment redirect to:', paymentLink);
      const urlWithCallback = new URL(paymentLink);
      if (user) {
        // Build an absolute URL for the callback with full protocol and domain
        const appHost = window.location.origin;

        // Create complete callback URL that Midtrans will redirect to
        const callbackUrl = `${appHost}/coins?source=midtrans`;
        console.log('Setting callback URL to:', callbackUrl);

        // Add the callback URL to the payment link as a query parameter
        urlWithCallback.searchParams.set('finish_redirect_url', callbackUrl);
        console.log('Final payment URL with callback:', urlWithCallback.toString());
      }

      // Redirect to the Midtrans payment page
      window.location.href = urlWithCallback.toString();
    } catch (error) {
      console.error('Error preparing payment redirect:', error);
      toast({
        title: 'Gagal membuka halaman pembayaran',
        description: 'Terjadi kesalahan saat mempersiapkan halaman pembayaran',
        variant: 'destructive'
      });
    }
  };
  return <MainLayout>
      <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Beli Koin untuk
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 ml-2">
              Cerita Premium
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">Dapatkan akses ke cerita dan chapter premium dari penulis favorit anda. 
Koin berlaku selamanya tanpa batasan waktu.</p>
          
          {profile && <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-4 inline-flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg">
                <Coins size="default" />
                <span className="font-bold">{profile.coins || 0}</span>
              </div>
              <span>Koin tersedia saat ini</span>
            </div>}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="packages">Paket Koin</TabsTrigger>
              
            </TabsList>
            
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="mr-2" />
              Kembali
            </Button>
          </div>
          
          <TabsContent value="packages" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coinPackages.map(pkg => <Card key={pkg.id} className={`relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${pkg.popular ? 'border-primary bg-card/95 shadow-lg' : 'bg-card/60'}`}>
                  {pkg.popular && <div className="absolute -top-4 -right-12 rotate-45 bg-primary px-12 py-1 text-xs font-medium text-primary-foreground">
              </div>}
                  
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.popular ? 'Pilihan terbaik untuk pembaca aktif' : pkg.id === 'ultimate' ? 'Paket terlengkap untuk pembaca serius' : 'Untuk mencoba fitur premium'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                        {pkg.id === 'basic' ? <CoinsIcon size={28} className="text-yellow-400" /> : pkg.id === 'premium' ? <Gem size={28} className="text-primary" /> : <Sparkles size={28} className="text-purple-400" />}
                      </div>
                      
                      <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                        <CoinsIcon size={20} className="text-yellow-400" />
                        <span>{pkg.coins}</span>
                      </div>
                      
                      <div className="mt-1 text-2xl font-bold">{pkg.price}</div>
                      
                      
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {pkg.paymentLink ? <Button onClick={() => handleDirectPaymentRedirect(pkg.paymentLink!)} className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                        <CreditCard size={16} className="mr-2" />
                        Beli Sekarang
                      </Button> : <MidtransPayment packageData={pkg} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />}
                  </CardFooter>
                </Card>)}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-2">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 max-w-3xl mx-auto bg-secondary/50 rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4">Cara Koin Bekerja</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CoinsIcon size={20} className="text-primary" />
              </div>
              <h4 className="font-medium">Beli Koin</h4>
              <p className="text-sm text-muted-foreground">
                Beli paket koin sesuai dengan kebutuhan anda. Koin akan langsung masuk ke akun.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
              <h4 className="font-medium">Buka Konten Premium</h4>
              <p className="text-sm text-muted-foreground">
                Gunakan koin untuk mengakses chapter premium dari cerita favorit anda. Harga tiap chapter bervariasi dari 1-5 koin.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <h4 className="font-medium">Dukung Penulis</h4>
              <p className="text-sm text-muted-foreground">
                Setiap koin yang anda belanjakan juga mendukung para penulis cerita.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Koin yang telah dibeli tidak dapat dikembalikan atau ditukarkan dengan uang tunai. Koin tidak memiliki masa berlaku dan dapat digunakan kapan saja.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>;
};
export default CoinsPage;