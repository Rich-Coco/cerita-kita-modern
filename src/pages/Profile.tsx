import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bookmark, BookOpen, Pencil } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Profile = () => {
  const [profileTab, setProfileTab] = useState('stories');
  const navigate = useNavigate();

  const handleWriteStory = () => {
    navigate('/publish');
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
                    <AvatarFallback>
                      <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">Pengguna</h2>
                    <p className="text-muted-foreground">@pengguna</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleWriteStory} className="w-full">
              <Pencil size={16} className="mr-2" />
              Tulis Cerita
            </Button>
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
              </TabsList>
              
              <TabsContent value="stories" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Cerita Saya</h2>
                  <Button onClick={handleWriteStory} variant="outline" size="sm">
                    <BookOpen size={16} className="mr-2" />
                    Tulis Cerita Baru
                  </Button>
                </div>
                
                <div className="bg-secondary/40 backdrop-blur-sm rounded-lg border border-border p-8 text-center">
                  <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Belum Ada Cerita</h3>
                  <p className="text-muted-foreground mb-4">
                    Fitur ini memerlukan koneksi database. Hubungkan database untuk mulai menulis cerita.
                  </p>
                  <Button onClick={handleWriteStory}>
                    <Pencil size={16} className="mr-2" />
                    Tulis Cerita Pertama
                  </Button>
                </div>
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
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
