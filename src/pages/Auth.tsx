
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (userData: any) => {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    toast({
      title: "Login Berhasil",
      description: "Selamat datang kembali di CeritaKita!"
    });
    navigate('/profile');
  };

  const handleSignupSuccess = (userData: any) => {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    navigate('/profile-setup');
  };

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else {
      const searchParams = new URLSearchParams(location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam === 'signup') {
        setActiveTab('signup');
      }
    }
  }, [location]);

  const handleDemoLogin = () => {
    const mockUserData = {
      id: 'user-123',
      name: 'User Demo',
      email: 'user@example.com',
      avatar: 'https://i.pravatar.cc/150?img=32'
    };
    handleLoginSuccess(mockUserData);
  };

  return <MainLayout>
      <div className="container max-w-md mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <img src="/lovable-uploads/hunt-logo.png" alt="Hunt Logo" className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold tracking-tight">Hunt</h1>
          <p className="text-muted-foreground text-center mt-2">
            Gabung dengan komunitas penulis dan pembaca cerita Indonesia
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="signup">Daftar</TabsTrigger>
          </TabsList>
          
          <Card className="border-none glass-card">
            <TabsContent value="login" className="mt-0">
              <CardHeader>
                <CardTitle>Masuk ke Akun</CardTitle>
                <CardDescription>
                  Masuk untuk melanjutkan cerita favoritmu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm onSuccess={handleLoginSuccess} />
              </CardContent>
              
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <CardHeader>
                <CardTitle>Buat Akun Baru</CardTitle>
                <CardDescription>
                  Gabung komunitas pembaca dan penulis Indonesia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignupForm onSuccess={handleSignupSuccess} />
              </CardContent>
              
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>;
};

export default Auth;
