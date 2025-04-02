
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GenreCardProps {
  title: string;
  image: string;
  count: number;
  className?: string;
}

const GenreCard = ({ title, image, count, className }: GenreCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback gradient background based on genre name
  const getGradientByGenre = (genre: string) => {
    const genreMap: Record<string, string> = {
      'Fiksi Fantasi': 'from-indigo-900 to-purple-700',
      'Romance': 'from-pink-600 to-rose-500',
      'Techno Thriller': 'from-emerald-800 to-green-600',
      'Misteri': 'from-amber-900 to-yellow-700',
      'Horor': 'from-red-900 to-red-600',
      'Petualangan': 'from-blue-900 to-cyan-700',
      'Drama': 'from-orange-800 to-amber-600',
      'Aksi': 'from-slate-800 to-slate-600',
      'Sejarah': 'from-stone-800 to-stone-600',
    };
    
    return genreMap[genre] || 'from-gray-900 to-gray-700';
  };

  return (
    <Link 
      to={`/search?genre=${encodeURIComponent(title)}`}
      className={cn(
        "block relative h-40 rounded-lg overflow-hidden group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 z-10" />
      
      {/* Fallback colored gradient if image fails to load */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br", 
        getGradientByGenre(title),
        imageError ? "opacity-100" : "opacity-0"
      )} />
      
      <img 
        src={image} 
        alt={title}
        onError={() => setImageError(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
          imageError ? "opacity-0" : "opacity-100"
        )}
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
