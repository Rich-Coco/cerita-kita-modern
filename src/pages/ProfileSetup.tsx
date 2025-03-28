
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { User, Upload, Loader2 } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    email: "",
  });

  // Initialize form with data from signup if available
  useEffect(() => {
    if (location.state?.userData) {
      const { name, email } = location.state.userData;
      setProfileData(prev => ({
        ...prev,
        name: name || "",
        email: email || "",
      }));
    }
  }, [location.state]);

  // Preview the avatar before upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Profile setup submitted:', profileData);
      
      toast({
        title: "Profil berhasil dibuat",
        description: "Selamat datang di CeritaKita!",
      });

      // Redirect to profile page
      navigate('/profile');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="py-8 max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Lengkapi Profil Anda</CardTitle>
            <CardDescription>
              Bantu kami mengenal Anda lebih baik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={avatarPreview || ""} />
                    <AvatarFallback className="bg-primary/20">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute -bottom-2 -right-2">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                        <Upload size={14} />
                      </div>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Nama lengkap Anda"
                    value={profileData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    placeholder="Email Anda"
                    value={profileData.email}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email tidak dapat diubah setelah pendaftaran
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="username_anda"
                    value={profileData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Username akan digunakan sebagai identitas unik Anda
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="min-h-24"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit}
              className="w-full" 
              disabled={isLoading || !profileData.name || !profileData.username}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Simpan Profil"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfileSetup;
