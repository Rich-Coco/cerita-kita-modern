
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Transaction } from '@/types/payment';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Use the PostgreSQL table name directly with type assertion to bypass TypeScript check
        const { data, error } = await (supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10) as any);
        
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        setTransactions(data || []);
      } catch (error) {
        console.error('Error in fetchTransactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  const formatPaymentType = (type: string | null) => {
    if (!type) return 'N/A';
    
    // Format camelCase or snake_case to Title Case
    return type
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };
  
  if (transactions.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Belum ada transaksi</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Belum ada riwayat transaksi yang tercatat.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
        <CardDescription>Transaksi terbaru Anda</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-4 h-16 bg-secondary rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Pembelian {transaction.coins} Koin</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Via: {formatPaymentType(transaction.payment_type) || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(transaction.status)}`}
                  >
                    {transaction.status === 'success' ? 'Berhasil' : 
                     transaction.status === 'pending' ? 'Pending' : 'Gagal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
