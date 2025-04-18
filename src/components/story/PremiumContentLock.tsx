
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumContentLockProps {
  isUserLoggedIn: boolean;
  onPurchase: () => void;
  coins?: number;
  price?: number;
}

const PremiumContentLock = ({
  isUserLoggedIn,
  onPurchase,
  coins,
  price
}: PremiumContentLockProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 bg-secondary/30 rounded-xl border border-border">
      <Lock size={48} className="text-amber-500 mb-2" />
      <h3 className="text-xl font-bold text-center">Konten Premium</h3>
      
      {coins !== undefined && price !== undefined && (
        <p className="text-center text-muted-foreground">
          Koin anda: <span className="font-semibold">{coins}</span> | 
          Harga chapter: <span className="font-semibold">{price}</span>
        </p>
      )}
      
      <p className="text-center text-muted-foreground max-w-md">
        Fitur premium saat ini tidak tersedia.
      </p>
      
      {isUserLoggedIn ? (
        <Button 
          className="mt-4"
          onClick={onPurchase}
          disabled={true}
        >
          Fitur Premium Tidak Tersedia
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
    </div>
  );
};

export default PremiumContentLock;
