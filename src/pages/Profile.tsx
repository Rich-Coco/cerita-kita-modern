import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { User, Bookmark, BookOpen, Settings, Pencil, Save, Coins, Heart, Eye } from 'lucide-react';
import StoryCard from '@/components/story/StoryCard';
import { stories } from '@/data/stories';
import MainLayout from '@/components/layout/MainLayout';

const Profile = () => {
  const [profileTab, setProfileTab] = useState('stories');
  const [isEditing, setIsEditing] = useState(false);
  
  const [userData, setUserData] = useState({
    name: 'Budi Pratama',
    username: 'budipratama',
    bio: 'Penulis cerita fiksi dan penggemar sastra. Suka menulis cerita tentang petualangan dan misteri.',
    email: 'budi.pratama@example.com',
    avatar: 'https://i.pravatar.cc/150?img=32',
    coins: 120,
    joined: 'November 2023',
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil Diperbarui",
      description: "Informasi profil anda telah berhasil diperbarui.",
    });
    setIsEditing(false);
  };
  
  return (
    <MainLayout>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-accent" />
              
              <CardContent className="pt-0">
                <div className="flex flex-col items-center -mt-12">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>BP</AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p className="text-muted-foreground">@{userData.username}</p>
                    
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-black/20">
                        <BookOpen size={12} className="mr-1" /> Penulis
                      </Badge>
                      
                      <Badge variant="outline" className="bg-black/20 text-yellow-400">
                        <Coins size={12} className="mr-1" /> {userData.coins}
                      </Badge>
                    </div>
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
                  
                  <div className="mt-4 w-full grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/coins">
                        <Coins size={16} className="mr-2 text-yellow-400" />
                        Beli Koin
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/publish">
                        <Pencil size={16} className="mr-2" />
                        Tulis Cerita
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="hidden md:block">
              <h3 className="font-medium mb-3">Statistik</h3>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cerita Diterbitkan</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Pembaca</span>
                    <span className="font-medium">12,540</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Chapter Premium</span>
                    <span className="font-medium">6</span>
                  </div>
                </CardContent>
              </Card>
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
                  <Button asChild variant="outline" size="sm">
                    <Link to="/publish">
                      <BookOpen size={16} className="mr-2" />
                      Tulis Cerita Baru
                    </Link>
                  </Button>
                </div>
                
                {stories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {stories.map((story) => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/40 backdrop-blur-sm rounded-lg border border-border p-8 text-center">
                    <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Belum Ada Cerita</h3>
                    <p className="text-muted-foreground mb-4">
                      Anda belum menerbitkan cerita. Mulai menulis dan bagikan kreativitas anda dengan dunia!
                    </p>
                    <Button asChild>
                      <Link to="/publish">
                        <Pencil size={16} className="mr-2" />
                        Tulis Cerita Pertama
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bookmarks" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Bookmark</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {stories.slice(0, 2).map((story) => (
                    <div key={story.id} className="relative group">
                      <StoryCard story={story} />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border border-white/10"
                        onClick={() => {
                          toast({
                            title: "Bookmark Dihapus",
                            description: `"${story.title}" telah dihapus dari bookmark anda.`,
                          });
                        }}
                      >
                        <Bookmark size={16} className="fill-current" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Pengaturan Profil</h2>
                  
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>
                
                <div className="bg-card rounded-lg border border-border p-6">
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarImage src={userData.avatar} />
                            <AvatarFallback>BP</AvatarFallback>
                          </Avatar>
                          
                          <Button 
                            size="icon" 
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          >
                            <Pencil size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama</Label>
                          <Input 
                            id="name" 
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={userData.bio}
                          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                          className="min-h-32"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Batal
                        </Button>
                        
                        <Button type="submit">
                          <Save size={16} className="mr-2" />
                          Simpan Perubahan
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
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
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p>{userData.email}</p>
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
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Koin</h3>
                            <div className="flex items-center gap-1">
                              <Coins size={16} className="text-yellow-400" />
                              <p>{userData.coins} Koin</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-medium mb-3">Statistik</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 text-center">
                            <BookOpen size={20} className="mx-auto mb-1" />
                            <div className="text-2xl font-bold">4</div>
                            <div className="text-xs text-muted-foreground">Cerita</div>
                          </div>
                          
                          <div className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 text-center">
                            <Eye size={20} className="mx-auto mb-1" />
                            <div className="text-2xl font-bold">12,540</div>
                            <div className="text-xs text-muted-foreground">Pembaca</div>
                          </div>
                          
                          <div className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 text-center">
                            <Heart size={20} className="mx-auto mb-1 text-red-500" />
                            <div className="text-2xl font-bold">892</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          
                          <div className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 text-center">
                            <Bookmark size={20} className="mx-auto mb-1" />
                            <div className="text-2xl font-bold">16</div>
                            <div className="text-xs text-muted-foreground">Bookmark</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
