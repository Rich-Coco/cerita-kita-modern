
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CoinsPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Fitur Premium
            </h1>
            
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="mr-2" />
              Kembali
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Fitur Premium Tidak Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fitur premium saat ini tidak tersedia. Silakan kembali di lain waktu.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoinsPage;
