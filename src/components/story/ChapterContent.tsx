
import React from 'react';
import { Chapter } from '@/types/story';
import PremiumContentLock from './PremiumContentLock';

interface ChapterContentProps {
  chapter: Chapter;
  isPremiumLocked: boolean;
  isUserLoggedIn: boolean;
  userCoins?: number;
  chapterPrice: number;
  onPurchaseChapter: () => Promise<void>;
}

const ChapterContent = ({
  chapter,
  isPremiumLocked,
  isUserLoggedIn,
  userCoins,
  chapterPrice,
  onPurchaseChapter
}: ChapterContentProps) => {
  if (isPremiumLocked) {
    return (
      <PremiumContentLock
        isUserLoggedIn={isUserLoggedIn}
        onPurchase={onPurchaseChapter}
        coins={userCoins}
        price={chapterPrice}
      />
    );
  }

  return (
    <div>
      {chapter.content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed text-lg">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ChapterContent;
