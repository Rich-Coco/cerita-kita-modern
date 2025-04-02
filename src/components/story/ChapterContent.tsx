
import React from 'react';
import { Chapter, PurchasedChapter } from '@/types/story';
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
  const hasEnoughCoins = userCoins !== undefined && userCoins >= chapterPrice;
  
  if (isPremiumLocked) {
    return (
      <PremiumContentLock
        chapterPrice={chapterPrice}
        isUserLoggedIn={isUserLoggedIn}
        hasEnoughCoins={hasEnoughCoins}
        userCoins={userCoins}
        onPurchase={onPurchaseChapter}
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
