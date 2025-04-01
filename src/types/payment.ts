
export type PackageType = {
  id: string;
  name: string;
  coins: number;
  price: string;
  priceValue: number;
  features: string[];
  popular: boolean;
  paymentLink?: string;
};

export type TransactionStatus = 'pending' | 'success' | 'failed';

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  coins: number;
  status: TransactionStatus;
  midtrans_order_id: string;
  midtrans_transaction_id: string | null;
  payment_type: string | null;
  created_at: string;
  updated_at: string;
};
