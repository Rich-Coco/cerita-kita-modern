import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '@/data/stories';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import StoryInfoView from '@/components/story/StoryInfoView';
import ReadingView from '@/components/story/ReadingView';

const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const story = stories.find(s => s.id === id);

  if (!story) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold">Cerita tidak ditemukan</h1>
          <p className="text-muted-foreground mt-2">Cerita yang Anda cari tidak dapat ditemukan.</p>
          <Button asChild className="mt-4">
            <Link to="/search"><ChevronLeft className="mr-2 h-4 w-4" />Kembali ke pencarian</Link>
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

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setIsReading(true);
    window.scrollTo(0, 0);
  };

  const handleBookmark = () => {
    toast({ title: "Cerita Disimpan", description: "Cerita telah ditambahkan ke daftar bacaan Anda." });
  };

  return (
    <MainLayout>
      {isReading ? (
        <ReadingView
          currentChapter={currentChapter}
          currentChapterIndex={currentChapterIndex}
          totalChapters={story.chapters.length}
          isPremiumLocked={false}
          isLoggedIn={false}
          onBackClick={() => setIsReading(false)}
          onBookmark={handleBookmark}
          onNavigateChapter={navigateChapter}
          onSelectChapter={handleSelectChapter}
          onPurchaseChapter={async () => {}}
        />
      ) : (
        <StoryInfoView
          story={story}
          onStartReading={() => { setCurrentChapterIndex(0); setIsReading(true); }}
          onSelectChapter={handleSelectChapter}
          onBookmark={handleBookmark}
        />
      )}
    </MainLayout>
  );
};

export default StoryPage;
