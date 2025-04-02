
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bookmark } from 'lucide-react';
import ChapterContent from './ChapterContent';
import ChapterNavigation from './ChapterNavigation';
import { Chapter } from '@/types/story';

interface ReadingViewProps {
  currentChapter: Chapter;
  currentChapterIndex: number;
  totalChapters: number;
  isPremiumLocked: boolean;
  isLoggedIn: boolean;
  userCoins?: number;
  onBackClick: () => void;
  onBookmark: () => void;
  onNavigateChapter: (direction: 'next' | 'prev') => void;
  onSelectChapter: (index: number) => void;
  onPurchaseChapter: () => Promise<void>;
}

const ReadingView = ({
  currentChapter,
  currentChapterIndex,
  totalChapters,
  isPremiumLocked,
  isLoggedIn,
  userCoins,
  onBackClick,
  onBookmark,
  onNavigateChapter,
  onSelectChapter,
  onPurchaseChapter
}: ReadingViewProps) => {
  const chapterPrice = currentChapter.coinPrice || 1;

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-16 z-10 bg-background border-b border-border py-3">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackClick}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBookmark}
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
            Bab {currentChapterIndex + 1} dari {totalChapters}
          </p>
        </div>
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 pb-10">
        <ChapterContent 
          chapter={currentChapter}
          isPremiumLocked={isPremiumLocked}
          isUserLoggedIn={isLoggedIn}
          userCoins={userCoins}
          chapterPrice={chapterPrice}
          onPurchaseChapter={onPurchaseChapter}
        />
        
        <ChapterNavigation 
          currentChapterIndex={currentChapterIndex}
          totalChapters={totalChapters}
          onNavigate={onNavigateChapter}
          onChapterSelect={onSelectChapter}
        />
      </div>
    </div>
  );
};

export default ReadingView;
