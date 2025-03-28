
import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '@/types/story';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Eye, Heart, BookOpen } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const StoryCard = ({ story, variant = 'default', className }: StoryCardProps) => {
  // Format the date
  const formattedDate = new Date(story.datePublished).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link to={`/story/${story.id}`} className="block">
        <div className="flex items-center gap-3 group">
          <img 
            src={story.cover} 
            alt={story.title}
            className="w-12 h-16 object-cover rounded-md border border-border"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight truncate group-hover:text-primary transition-colors">
              {story.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {story.author}
            </p>
          </div>
        </div>
      </Link>
    );
  }
  
  // Featured variant
  if (variant === 'featured') {
    return (
      <Link to={`/story/${story.id}`} className="block">
        <Card className={cn("overflow-hidden group h-full border-border", className)}>
          <div className="grid grid-cols-1 md:grid-cols-5 h-full">
            <div className="md:col-span-2 relative">
              <img 
                src={story.cover}
                alt={story.title}
                className="object-cover w-full h-full min-h-52"
              />
              <Badge className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm hover:bg-primary">
                {story.genre}
              </Badge>
            </div>
            <CardContent className="md:col-span-3 p-5 flex flex-col h-full">
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {story.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${story.author}`} />
                  <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{story.author}</span>
              </div>
              
              <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-4 flex-grow">
                {story.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
                {story.tags.length > 3 && <Badge variant="outline">+{story.tags.length - 3}</Badge>}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                <div className="flex items-center gap-4">
                  {story.views && (
                    <div className="flex items-center gap-1">
                      <Eye size={15} />
                      <span>{story.views.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {story.likes && (
                    <div className="flex items-center gap-1">
                      <Heart size={15} />
                      <span>{story.likes.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <BookOpen size={15} />
                    <span>{story.chapters.length} bab</span>
                  </div>
                </div>
                
                <span>{formattedDate}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }
  
  // Default variant
  return (
    <Link to={`/story/${story.id}`} className="block">
      <Card className={cn("overflow-hidden h-full group border-border", className)}>
        <div className="relative aspect-[3/4]">
          <img 
            src={story.cover}
            alt={story.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <p className="text-white text-sm line-clamp-3">{story.synopsis}</p>
          </div>
          <Badge className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm hover:bg-primary">
            {story.genre}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate mb-1 group-hover:text-primary transition-colors">
            {story.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-5 w-5">
              <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${story.author}`} />
              <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{story.author}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {story.views && (
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{story.views.toLocaleString()}</span>
                </div>
              )}
              
              {story.likes && (
                <div className="flex items-center gap-1">
                  <Heart size={12} />
                  <span>{story.likes.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <span>{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StoryCard;
