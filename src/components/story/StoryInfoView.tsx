
import React from 'react';
import { Story, PurchasedChapter } from '@/types/story';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, Heart, Calendar, Bookmark, Play } from 'lucide-react';
import ChaptersList from './ChaptersList';

interface StoryInfoViewProps {
  story: Story;
  purchasedChapters?: PurchasedChapter[];
  onStartReading: () => void;
  onSelectChapter: (index: number) => void;
  onBookmark: () => void;
}

const StoryInfoView = ({ 
  story, 
  purchasedChapters = [],
  onStartReading, 
  onSelectChapter, 
  onBookmark 
}: StoryInfoViewProps) => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img 
            src={story.cover} 
            alt={story.title}
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <p className="text-lg font-medium">{story.author}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{story.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{story.likes || 0} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{story.datePublished}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {story.genre}
            </span>
            {story.tags?.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-muted-foreground">
            {story.synopsis}
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={onStartReading}>
              <Play className="mr-2 h-4 w-4" />
              Mulai Membaca
            </Button>
            <Button variant="outline" onClick={onBookmark}>
              <Bookmark className="mr-2 h-4 w-4" />
              Simpan
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Daftar Chapter</h2>
        <ChaptersList 
          chapters={story.chapters} 
          purchasedChapters={purchasedChapters}
          onSelectChapter={onSelectChapter} 
        />
      </div>
    </div>
  );
};

export default StoryInfoView;
