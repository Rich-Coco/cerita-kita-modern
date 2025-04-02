import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { User, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
  });

  // Preview the avatar before upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
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

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to the avatars bucket
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true,
          contentType: avatarFile.type
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      console.log('Uploaded avatar URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading avatar",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Validate username (required)
      if (!profileData.username.trim()) {
        toast({
          title: "Username required",
          description: "Please enter a username",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Upload avatar if changed
      let avatarUrl = profileData.avatar_url;
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }

      // Update profile
      await updateProfile({
        username: profileData.username,
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: avatarUrl,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });

      // Navigate to profile page
      navigate('/profile');
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      toast({
        title: "Error setting up profile",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                    <AvatarImage src={avatarPreview || profileData.avatar_url} />
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
                  <Label htmlFor="full_name">Nama Lengkap</Label>
                  <Input 
                    id="full_name" 
                    name="full_name" 
                    placeholder="Nama lengkap Anda"
                    value={profileData.full_name}
                    onChange={handleInputChange}
                  />
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
              disabled={isLoading || !profileData.username}
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
