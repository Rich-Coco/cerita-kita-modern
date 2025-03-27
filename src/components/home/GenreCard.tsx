
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GenreCardProps {
  title: string;
  image: string;
  count: number;
  className?: string;
}

const GenreCard = ({ title, image, count, className }: GenreCardProps) => {
  return (
    <Link 
      to={`/search?genre=${encodeURIComponent(title)}`}
      className={cn(
        "block relative h-40 rounded-lg overflow-hidden group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 z-10" />
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="text-xs text-white/70">{count} cerita</p>
      </div>
      
      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
    </Link>
  );
};

export default GenreCard;
