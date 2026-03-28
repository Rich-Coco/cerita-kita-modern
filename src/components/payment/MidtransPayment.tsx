import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PackageType } from '@/types/payment';

interface MidtransPaymentProps {
  packageData: PackageType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const MidtransPayment = ({ packageData }: MidtransPaymentProps) => {
  return (
    <Button className="w-full" variant={packageData.popular ? 'default' : 'outline'} disabled>
      <CreditCard size={16} className="mr-2" />
      Tidak Tersedia
    </Button>
  );
};

export default MidtransPayment;
