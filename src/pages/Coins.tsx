
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coin, CreditCard, Check, Gem, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';

const coinPackages = [
  {
    id: 'basic',
    name: 'Paket Dasar',
    coins: 50,
    price: 'Rp 25.000',
    priceValue: 25000,
    features: [
      'Akses ke 1 chapter premium',
      'Berlaku selamanya',
      'Tidak ada batasan waktu'
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Paket Premium',
    coins: 150,
    price: 'Rp 65.000',
    priceValue: 65000,
    features: [
      'Akses ke 5 chapter premium',
      'Diskon 15% dari harga per koin',
      'Hadiah bonus badge profil',
      'Berlaku selamanya'
    ],
    popular: true,
  },
  {
    id: 'ultimate',
    name: 'Paket Ultimate',
    coins: 500,
    price: 'Rp 175.000',
    priceValue: 175000,
    features: [
      'Akses ke 20 chapter premium',
      'Diskon 30% dari harga per koin',
      'Hadiah bonus badge profil eksklusif',
      'Fitur highlight komentar',
      'Berlaku selamanya'
    ],
    popular: false,
  }
];

const Coins = () => {
  const handlePurchase = (packageId: string) => {
    toast({
      title: "Pembelian Berhasil!",
      description: `Paket koin telah ditambahkan ke akun anda.`,
    });
  };
  
  return (
    <MainLayout>
      <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Beli Koin untuk
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 ml-2">
              Cerita Premium
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dapatkan akses ke cerita dan chapter premium dari penulis favorit anda. Koin berlaku selamanya tanpa batasan waktu.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {coinPackages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                pkg.popular 
                  ? 'border-primary bg-card/95 shadow-lg' 
                  : 'bg-card/60'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 -right-12 rotate-45 bg-primary px-12 py-1 text-xs font-medium text-primary-foreground">
                  Populer
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>
                  {pkg.popular 
                    ? 'Pilihan terbaik untuk pembaca aktif' 
                    : pkg.id === 'ultimate' 
                      ? 'Paket terlengkap untuk pembaca serius'
                      : 'Untuk mencoba fitur premium'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                    {pkg.id === 'basic' ? (
                      <Coin size={28} className="text-yellow-400" />
                    ) : pkg.id === 'premium' ? (
                      <Gem size={28} className="text-primary" />
                    ) : (
                      <Sparkles size={28} className="text-purple-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                    <Coin size={20} className="text-yellow-400" />
                    <span>{pkg.coins}</span>
                  </div>
                  
                  <div className="mt-1 text-2xl font-bold">{pkg.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((pkg.priceValue / pkg.coins) * 100) / 100} per koin
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase(pkg.id)} 
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  <CreditCard size={16} className="mr-2" />
                  Beli Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-secondary/50 rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4">Cara Koin Bekerja</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Coin size={20} className="text-primary" />
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
                Gunakan koin untuk mengakses chapter premium dari cerita favorit anda.
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
    </MainLayout>
  );
};

import { BookOpen, Users } from 'lucide-react';

export default Coins;
