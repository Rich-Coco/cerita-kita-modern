
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

interface ChapterNavigationProps {
  currentChapterIndex: number;
  totalChapters: number;
  onNavigate: (direction: 'next' | 'prev') => void;
  onChapterSelect: (index: number) => void;
}

const ChapterNavigation = ({ 
  currentChapterIndex, 
  totalChapters, 
  onNavigate, 
  onChapterSelect 
}: ChapterNavigationProps) => {
  return (
    <>
      <div className="mt-12 flex justify-between">
        <Button
          variant="outline"
          onClick={() => onNavigate('prev')}
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
          onClick={() => onNavigate('next')}
          disabled={currentChapterIndex === totalChapters - 1}
          className={cn(
            currentChapterIndex === totalChapters - 1 && "opacity-50 cursor-not-allowed"
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
                onClick={() => onNavigate('prev')} 
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
          
          {Array.from({ length: totalChapters }).map((_, index) => {
            if (
              index === 0 || 
              index === currentChapterIndex - 1 || 
              index === currentChapterIndex || 
              index === currentChapterIndex + 1 || 
              index === totalChapters - 1
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={index === currentChapterIndex}
                    onClick={() => onChapterSelect(index)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              index === 1 || 
              index === totalChapters - 2
            ) {
              return <PaginationItem key={index}><PaginationEllipsis /></PaginationItem>;
            }
            return null;
          })}
          
          {currentChapterIndex < totalChapters - 1 && (
            <PaginationItem>
              <PaginationNext 
                onClick={() => onNavigate('next')} 
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ChapterNavigation;
