
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins } from '@/components/ui/coins';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumContentLockProps {
  chapterPrice: number;
  isUserLoggedIn: boolean;
  hasEnoughCoins: boolean;
  userCoins?: number;
  onPurchase: () => void;
}

const PremiumContentLock = ({
  chapterPrice,
  isUserLoggedIn,
  hasEnoughCoins,
  userCoins,
  onPurchase
}: PremiumContentLockProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 bg-secondary/30 rounded-xl border border-border">
      <Lock size={48} className="text-amber-500 mb-2" />
      <h3 className="text-xl font-bold text-center">Konten Premium</h3>
      <p className="text-center text-muted-foreground max-w-md">
        Bab ini hanya tersedia untuk pembaca premium. Gunakan koin untuk membaca chapter ini.
      </p>
      <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-lg mt-2">
        <Coins size="lg" />
        <span className="text-xl font-bold text-amber-600">{chapterPrice}</span>
      </div>
      
      {isUserLoggedIn ? (
        <Button 
          className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600"
          onClick={onPurchase}
          disabled={!hasEnoughCoins}
        >
          <Coins className="mr-2 h-4 w-4" />
          Beli Chapter Ini
        </Button>
      ) : (
        <Button 
          className="mt-4"
          asChild
        >
          <Link to="/auth">
            Login untuk Melanjutkan
          </Link>
        </Button>
      )}
      
      {isUserLoggedIn && !hasEnoughCoins && (
        <Button 
          variant="outline"
          className="mt-2"
          asChild
        >
          <Link to="/coins">
            <Coins className="mr-2 h-4 w-4" />
            Beli Koin {userCoins !== undefined && `(Anda memiliki ${userCoins})`}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PremiumContentLock;
