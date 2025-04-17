
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { User, Bookmark, BookOpen, Settings, Pencil, Save, Coins, Upload, Loader2, Wallet } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { uploadAvatar } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const [profileTab, setProfileTab] = useState('stories');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const navigate = useNavigate();
  
  const {
    user,
    profile,
    updateProfile
  } = useAuth();
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    bio: '',
    email: '',
    avatar: '',
    coins: 0,
    joined: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  useEffect(() => {
    if (user) {
      console.log('User ID for fetching stories:', user.id);
      fetchUserStories();
    }
  }, [user]);
  
  useEffect(() => {
    if (profileTab === 'stories' && user) {
      console.log('Tab changed to stories or component rerendered, fetching stories again');
      fetchUserStories();
    }
  }, [profileTab, user]);
  
  const fetchUserStories = async () => {
    if (!user) {
      console.log('No user found, skipping story fetch');
      return;
    }
    
    try {
      setIsLoadingStories(true);
      
      console.log('Fetching stories for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', user.id);
        
      if (error) {
        console.error('Error fetching user stories:', error);
        toast({
          title: "Error",
          description: "Failed to load your stories. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Fetched user stories:', data);
      
      if (data) {
        setUserStories(data);
      } else {
        setUserStories([]);
      }
    } catch (error) {
      console.error('Error in fetchUserStories:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading your stories.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStories(false);
    }
  };
  
  useEffect(() => {
    if (profile) {
      console.log('Setting user data from profile:', profile);
      setUserData({
        name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        email: user?.email || '',
        avatar: profile.avatar_url || '',
        coins: profile.coins || 0,
        joined: formatDate(profile.created_at)
      });
      setAvatarKey(Date.now());
    }
  }, [profile, user]);
  
  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Avatar file selected:', file.name, file.type);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileUpdate = async e => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let avatarUrl = userData.avatar;
      if (avatarFile) {
        console.log('Uploading avatar file...');
        const newAvatarUrl = await uploadAvatar(avatarFile, user.id);
        if (newAvatarUrl) {
          console.log('Successfully uploaded avatar, new URL:', newAvatarUrl);
          avatarUrl = newAvatarUrl;
        } else {
          console.error('Failed to upload avatar');
          toast({
            title: "Avatar upload failed",
            description: "Could not upload avatar, but continuing with other profile updates",
            variant: "destructive"
          });
        }
      }
      const updatedProfile = {
        full_name: userData.name,
        username: userData.username,
        bio: userData.bio,
        avatar_url: avatarUrl
      };
      console.log('Updating profile with:', updatedProfile);
      await updateProfile(updatedProfile);

      setAvatarKey(Date.now());
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast({
        title: "Profil diperbarui",
        description: "Informasi profil Anda berhasil disimpan"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Gagal",
        description: "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (profile) {
      setUserData({
        name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        email: user?.email || '',
        avatar: profile.avatar_url || '',
        coins: profile.coins || 0,
        joined: formatDate(profile.created_at)
      });
    }
  };

  const handleWriteStory = () => {
    navigate('/publish');
  };
  
  const handleRefreshStories = () => {
    fetchUserStories();
  };
  
  return <MainLayout>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-accent" />
              
              <CardContent className="pt-0">
                <div className="flex flex-col items-center -mt-12">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={userData.avatar} key={avatarKey} alt={userData.name || "User avatar"} />
                    <AvatarFallback>
                      {userData.name ? userData.name.charAt(0) + (userData.name.split(' ')[1]?.charAt(0) || '') : ''}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p className="text-muted-foreground">@{userData.username}</p>
                  </div>
                  
                  <div className="mt-4 w-full text-sm text-muted-foreground">
                    <p className="text-center">
                      {userData.bio}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between">
                        <span>Bergabung:</span>
                        <span className="text-foreground">{userData.joined}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-2">
              <Button onClick={handleWriteStory} className="w-full">
                <Pencil size={16} className="mr-2" />
                Tulis Cerita
              </Button>
            </div>
          </div>
          
          <div>
            <Tabs value={profileTab} onValueChange={setProfileTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="stories" className="gap-2">
                  <BookOpen size={16} /> Cerita Saya
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="gap-2">
                  <Bookmark size={16} /> Bookmark
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings size={16} /> Pengaturan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stories" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Cerita Saya</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleRefreshStories} variant="outline" size="sm" 
                            className="hidden md:flex">
                      <Loader2 className={`h-4 w-4 mr-2 ${isLoadingStories ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button onClick={handleWriteStory} variant="outline" size="sm">
                      <BookOpen size={16} className="mr-2" />
                      Tulis Cerita Baru
                    </Button>
                  </div>
                </div>
                
                {isLoadingStories ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userStories && userStories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {userStories.map(story => (
                      <Link to={`/story/${story.id}`} key={story.id} className="block">
                        <div className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 relative overflow-hidden group hover:bg-secondary/60 transition-all">
                          <Badge className="absolute top-2 left-2 z-10">{story.genre || 'Cerita'}</Badge>
                          <div className="relative aspect-[3/4] rounded-md overflow-hidden mb-3">
                            <img 
                              src={story.cover_url || 'https://images.unsplash.com/photo-1532012197267-da84d127e765'} 
                              alt={story.title} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            />
                          </div>
                          <h3 className="font-medium text-lg mt-2">{story.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{story.synopsis}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/40 backdrop-blur-sm rounded-lg border border-border p-8 text-center">
                    <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Belum Ada Cerita</h3>
                    <p className="text-muted-foreground mb-4">
                      Anda belum membuat cerita apapun. Mulai menulis cerita pertama Anda sekarang!
                    </p>
                    <Button onClick={handleWriteStory}>
                      <Pencil size={16} className="mr-2" />
                      Tulis Cerita Pertama
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bookmarks" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Bookmark</h2>
                </div>
                
                <div className="bg-secondary/40 backdrop-blur-sm rounded-lg border border-border p-8 text-center">
                  <Bookmark size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Belum Ada Bookmark</h3>
                  <p className="text-muted-foreground mb-4">
                    Anda belum menyimpan cerita apapun ke dalam bookmark.
                  </p>
                  <Button asChild>
                    <Link to="/search">
                      <BookOpen size={16} className="mr-2" />
                      Jelajahi Cerita
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Pengaturan Profil</h2>
                  
                  {!isEditing && <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Pencil size={16} className="mr-2" />
                      Edit Profil
                    </Button>}
                </div>
                
                <div className="bg-card rounded-lg border border-border p-6">
                  {isEditing ? <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarImage src={avatarPreview || userData.avatar} key={avatarKey} alt={userData.name || "User avatar"} />
                            <AvatarFallback>{userData.name.charAt(0)}{userData.name.split(' ')[1]?.charAt(0) || ''}</AvatarFallback>
                          </Avatar>
                          
                          <Label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                            <Upload size={14} />
                            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                          </Label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama</Label>
                          <Input id="name" value={userData.name} onChange={e => setUserData({
                        ...userData,
                        name: e.target.value
                      })} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" value={userData.username} onChange={e => setUserData({
                        ...userData,
                        username: e.target.value
                      })} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={userData.bio} onChange={e => setUserData({
                      ...userData,
                      bio: e.target.value
                    })} className="min-h-32" />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Batal
                        </Button>
                        
                        <Button type="submit" disabled={isUploading}>
                          {isUploading ? <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Uploading...
                            </> : <>
                              <Save size={16} className="mr-2" />
                              Simpan Perubahan
                            </>}
                        </Button>
                      </div>
                    </form> : <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Nama</h3>
                            <p>{userData.name}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                            <p>@{userData.username}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                            <p>{userData.bio}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Bergabung Sejak</h3>
                            <p>{userData.joined}</p>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>;
};
export default Profile;
