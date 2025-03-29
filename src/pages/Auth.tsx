
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle login success
  const handleLoginSuccess = (userData: any) => {
    // Store user data in session storage
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    // Show success toast
    toast({
      title: "Login Berhasil",
      description: "Selamat datang kembali di CeritaKita!"
    });
    
    // Redirect to profile page
    navigate('/profile');
  };

  // Handle signup success
  const handleSignupSuccess = (userData: any) => {
    // Store user data in session storage
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    // Redirect to profile setup page
    navigate('/profile-setup');
  };

  // Check for tab query parameter or location state on mount
  useEffect(() => {
    // Check for state passed from navigation
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else {
      // Check for URL param if no state
      const searchParams = new URLSearchParams(location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam === 'signup') {
        setActiveTab('signup');
      }
    }
  }, [location]);

  // This is a demo function for social login
  const handleDemoLogin = () => {
    const mockUserData = {
      id: 'user-123',
      name: 'User Demo',
      email: 'user@example.com',
      avatar: 'https://i.pravatar.cc/150?img=32'
    };
    
    handleLoginSuccess(mockUserData);
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <BookOpen className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold tracking-tight">CeritaKita</h1>
          <p className="text-muted-foreground text-center mt-2">
            Gabung dengan komunitas penulis dan pembaca cerita Indonesia
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
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
              <CardFooter className="flex flex-col gap-2">
                <div className="relative w-full my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">Atau lanjutkan dengan</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={handleDemoLogin}
                    className="bg-background border-border hover:bg-secondary"
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDemoLogin}
                    className="bg-background border-border hover:bg-secondary"
                  >
                    Facebook
                  </Button>
                </div>
              </CardFooter>
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
              <CardFooter className="flex flex-col gap-2">
                <div className="relative w-full my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">Atau daftar dengan</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={handleDemoLogin}
                    className="bg-background border-border hover:bg-secondary"
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDemoLogin}
                    className="bg-background border-border hover:bg-secondary"
                  >
                    Facebook
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Auth;
