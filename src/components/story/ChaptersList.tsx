
import React from 'react';
import { Chapter } from '@/types/story';
import { Lock } from 'lucide-react';
import { Coins } from '@/components/ui/coins';

interface ChaptersListProps {
  chapters: Chapter[];
  onSelectChapter: (index: number) => void;
}

const ChaptersList = ({ chapters, onSelectChapter }: ChaptersListProps) => {
  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => (
        <div 
          key={chapter.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer"
          onClick={() => onSelectChapter(index)}
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
  );
};

export default ChaptersList;
