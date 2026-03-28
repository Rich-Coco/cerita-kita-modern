import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

const TransactionHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
        <CardDescription>Belum ada transaksi</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Belum ada riwayat transaksi yang tercatat.</p>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
