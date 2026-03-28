import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bookmark, BookOpen, Pencil } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useUserStories } from '@/stores/useUserStories';

const Profile = () => {
  const [profileTab, setProfileTab] = useState('stories');
  const navigate = useNavigate();
  const userStories = useUserStories((s) => s.stories);

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

                {userStories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {userStories.map((story) => (
                      <div key={story.id} className="bg-secondary/40 backdrop-blur-sm rounded-lg p-4 relative overflow-hidden group hover:bg-secondary/60 transition-all">
                        <Badge className="absolute top-2 left-2 z-10">{story.genre || 'Cerita'}</Badge>
                        <div className="relative aspect-[3/4] rounded-md overflow-hidden mb-3">
                          <img
                            src={story.coverUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium text-lg mt-2">{story.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{story.synopsis}</p>
                        <p className="text-xs text-muted-foreground mt-2">{story.chapters.length} Chapter</p>
                      </div>
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
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
