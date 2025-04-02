
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '@/data/stories';
import { Story, Chapter } from '@/types/story';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  ChevronLeft, 
  Eye, 
  Heart, 
  Calendar, 
  Bookmark,
  BookmarkPlus,
  Lock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { Coins } from '@/components/ui/coins';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const { user, profile } = useAuth();

  const story = stories.find(s => s.id === id);

  if (!story) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold">Cerita tidak ditemukan</h1>
          <p className="text-muted-foreground mt-2">
            Cerita yang Anda cari tidak dapat ditemukan.
          </p>
          <Button asChild className="mt-4">
            <Link to="/search">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali ke pencarian
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];

  const navigateChapter = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else if (direction === 'prev' && currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePurchaseChapter = async () => {
    if (!user || !profile) {
      toast({
        title: "Login Diperlukan",
        description: "Anda perlu login untuk membeli chapter premium.",
        variant: "destructive",
      });
      return;
    }

    const chapterPrice = currentChapter.coinPrice || 1;
    
    if (profile.coins < chapterPrice) {
      toast({
        title: "Koin Tidak Cukup",
        description: `Anda membutuhkan ${chapterPrice} koin untuk membeli chapter ini. Silakan beli koin terlebih dahulu.`,
        variant: "destructive",
      });
      return;
    }

    // Here we would typically make a call to the backend to process the purchase
    // For now, we'll just show a success message
    toast({
      title: "Pembelian Berhasil",
      description: `Anda telah membeli chapter premium dengan ${chapterPrice} koin.`,
      variant: "default",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Cerita Disimpan",
      description: "Cerita telah ditambahkan ke daftar bacaan Anda.",
      variant: "default",
    });
  };

  const StoryInfoView = () => (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/search">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke pencarian
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border">
            <img 
              src={story.cover} 
              alt={story.title} 
              className="object-cover w-full h-full" 
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleBookmark} variant="outline" className="flex-1">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Simpan
            </Button>
            <Button 
              onClick={() => setIsReading(true)} 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Baca
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">{story.title}</h1>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${story.author}`} />
              <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{story.author}</span>
          </div>
          
          <div className="flex gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{new Date(story.datePublished).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            {story.views && (
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{story.views.toLocaleString()}</span>
              </div>
            )}
            
            {story.likes && (
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>{story.likes.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{story.genre}</Badge>
            {story.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Sinopsis</h3>
            <p className="text-muted-foreground">{story.synopsis}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Daftar Bab ({story.chapters.length})</h3>
            <div className="space-y-2">
              {story.chapters.map((chapter, index) => (
                <div 
                  key={chapter.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer"
                  onClick={() => {
                    setCurrentChapterIndex(index);
                    setIsReading(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{chapter.title}</span>
                  </div>
                  
                  {chapter.isPremium && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
                        <Coins size="sm" />
                        <span className="text-amber-600 font-medium">{chapter.coinPrice || 1}</span>
                      </div>
                      <Lock size={16} className="text-amber-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReadingView = () => {
    const isPremiumLocked = currentChapter.isPremium;
    const chapterPrice = currentChapter.coinPrice || 1;
    
    return (
      <div className="bg-background min-h-screen">
        <div className="sticky top-16 z-10 bg-background border-b border-border py-3">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsReading(false)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBookmark}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-black text-center py-16 mb-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentChapter.title}
            </h1>
            <p className="text-gray-300 text-base">
              Bab {currentChapterIndex + 1} dari {story.chapters.length}
            </p>
          </div>
        </div>
        
        <div className="container max-w-2xl mx-auto px-4 pb-10">
          {isPremiumLocked ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 bg-secondary/30 rounded-xl border border-border">
              <Lock size={48} className="text-amber-500 mb-2" />
              <h3 className="text-xl font-bold text-center">Konten Premium</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Bab ini hanya tersedia untuk pembaca premium. Gunakan koin untuk membaca chapter ini.
              </p>
              <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-lg mt-2">
                <Coins size="lg" />
                <span className="text-xl font-bold text-amber-600">{chapterPrice}</span>
              </div>
              
              {user ? (
                <Button 
                  className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600"
                  onClick={handlePurchaseChapter}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Beli Chapter Ini
                </Button>
              ) : (
                <Button 
                  className="mt-4"
                  asChild
                >
                  <Link to="/auth">
                    Login untuk Melanjutkan
                  </Link>
                </Button>
              )}
              {profile && profile.coins < chapterPrice && (
                <Button 
                  variant="outline"
                  className="mt-2"
                  asChild
                >
                  <Link to="/coins">
                    <Coins className="mr-2 h-4 w-4" />
                    Beli Koin
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div>
              {currentChapter.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          
          <div className="mt-12 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigateChapter('prev')}
              disabled={currentChapterIndex === 0}
              className={cn(
                currentChapterIndex === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Bab Sebelumnya
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigateChapter('next')}
              disabled={currentChapterIndex === story.chapters.length - 1}
              className={cn(
                currentChapterIndex === story.chapters.length - 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              Bab Selanjutnya
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Pagination className="mt-8">
            <PaginationContent>
              {currentChapterIndex > 0 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => navigateChapter('prev')} 
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              
              {story.chapters.map((_, index) => {
                if (
                  index === 0 || 
                  index === currentChapterIndex - 1 || 
                  index === currentChapterIndex || 
                  index === currentChapterIndex + 1 || 
                  index === story.chapters.length - 1
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        isActive={index === currentChapterIndex}
                        onClick={() => {
                          setCurrentChapterIndex(index);
                          window.scrollTo(0, 0);
                        }}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  index === 1 || 
                  index === story.chapters.length - 2
                ) {
                  return <PaginationItem key={index}><PaginationEllipsis /></PaginationItem>;
                }
                return null;
              })}
              
              {currentChapterIndex < story.chapters.length - 1 && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => navigateChapter('next')} 
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      {isReading ? <ReadingView /> : <StoryInfoView />}
    </MainLayout>
  );
};

export default StoryPage;
