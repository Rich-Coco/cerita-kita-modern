
import React from 'react';
import { Story } from '@/types/story';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, BookOpen, BookmarkPlus, Calendar, Eye, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ChaptersList from './ChaptersList';

interface StoryInfoViewProps {
  story: Story;
  onStartReading: () => void;
  onSelectChapter: (index: number) => void;
  onBookmark: () => void;
}

const StoryInfoView = ({ 
  story, 
  onStartReading, 
  onSelectChapter,
  onBookmark 
}: StoryInfoViewProps) => {
  return (
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
            <Button onClick={onBookmark} variant="outline" className="flex-1">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Simpan
            </Button>
            <Button 
              onClick={onStartReading} 
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
            <ChaptersList 
              chapters={story.chapters} 
              onSelectChapter={onSelectChapter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryInfoView;
