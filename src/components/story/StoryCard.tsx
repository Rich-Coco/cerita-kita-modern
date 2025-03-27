
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Story } from '@/types/story';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const StoryCard = ({ story, variant = 'default', className }: StoryCardProps) => {
  if (variant === 'featured') {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl group h-[400px]",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <img 
          src={story.cover} 
          alt={story.title} 
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary hover:bg-primary/90">{story.genre}</Badge>
              {story.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="bg-black/40 backdrop-blur-md border-white/10 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h3 className="text-2xl font-bold tracking-tight line-clamp-2">
              <Link to={`/stories/${story.id}`} className="hover:underline underline-offset-2">
                {story.title}
              </Link>
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-2">{story.synopsis}</p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm">Oleh <Link to={`/author/${story.author.replace(/\s+/g, '-').toLowerCase()}`} className="text-primary hover:underline">{story.author}</Link></span>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm">
                <Eye size={14} />
                {story.views?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Heart size={14} className="text-red-500" />
                {story.likes?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "group flex gap-4 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors",
          className
        )}
      >
        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
          <img 
            src={story.cover} 
            alt={story.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="font-medium line-clamp-1">
            <Link to={`/stories/${story.id}`} className="hover:text-primary transition-colors">
              {story.title}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground">Oleh {story.author}</p>
          <p className="text-xs">{story.chapters.length} chapter</p>
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <div 
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md hover:border-primary/30",
        className
      )}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={story.cover} 
          alt={story.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/20 backdrop-blur-xl border-white/10">
              {story.chapters.length} Chapter
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/90 hover:bg-primary">{story.genre}</Badge>
          </div>
          
          <h3 className="font-semibold tracking-tight line-clamp-1">
            <Link to={`/stories/${story.id}`} className="hover:text-primary transition-colors">
              {story.title}
            </Link>
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{story.synopsis}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs">Oleh {story.author}</span>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs">
              <Eye size={12} />
              {story.views?.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Heart size={12} className="text-red-500" />
              {story.likes?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
