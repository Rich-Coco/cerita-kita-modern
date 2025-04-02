
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '@/data/stories';
import { Story } from '@/types/story';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePurchasedChapters } from '@/hooks/usePurchasedChapters';
import StoryInfoView from '@/components/story/StoryInfoView';
import ReadingView from '@/components/story/ReadingView';

const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const { user, profile } = useAuth();
  
  const story = stories.find(s => s.id === id);
  
  const { purchasedChapters, isLoading, purchaseChapter } = usePurchasedChapters(
    user?.id, 
    id
  );

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
  const isChapterPurchased = purchasedChapters.some(pc => pc.chapter_id === currentChapter.id);
  const isPremiumLocked = currentChapter.isPremium && !isChapterPurchased;

  const navigateChapter = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else if (direction === 'prev' && currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setIsReading(true);
    window.scrollTo(0, 0);
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

    const success = await purchaseChapter(
      user,
      profile.coins,
      currentChapter.id,
      story.id,
      chapterPrice
    );
    
    if (success) {
      // Force UI update after successful purchase
      setIsReading(true);
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Cerita Disimpan",
      description: "Cerita telah ditambahkan ke daftar bacaan Anda.",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        isReading ? (
          <ReadingView
            currentChapter={currentChapter}
            currentChapterIndex={currentChapterIndex}
            totalChapters={story.chapters.length}
            isPremiumLocked={isPremiumLocked}
            isLoggedIn={!!user}
            userCoins={profile?.coins}
            onBackClick={() => setIsReading(false)}
            onBookmark={handleBookmark}
            onNavigateChapter={navigateChapter}
            onSelectChapter={handleSelectChapter}
            onPurchaseChapter={handlePurchaseChapter}
          />
        ) : (
          <StoryInfoView
            story={story}
            purchasedChapters={purchasedChapters}
            onStartReading={() => {
              setCurrentChapterIndex(0);
              setIsReading(true);
            }}
            onSelectChapter={handleSelectChapter}
            onBookmark={handleBookmark}
          />
        )
      )}
    </MainLayout>
  );
};

export default StoryPage;
