
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: 'primary' | 'secondary';
  className?: string;
}

const GradientSection = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink, 
  gradient, 
  className 
}: GradientSectionProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-8 md:p-12",
        gradient === 'primary' 
          ? "bg-gradient-to-br from-primary/90 to-accent/80" 
          : "bg-gradient-to-br from-gray-900 to-black",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      
      <div className="relative z-10 max-w-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        
        <p className="text-white/80 mb-6">
          {description}
        </p>
        
        <Button 
          asChild
          variant={gradient === 'primary' ? 'secondary' : 'default'}
          className={gradient === 'primary' 
            ? "bg-black text-white hover:bg-black/80" 
            : "bg-primary text-white hover:bg-primary/90"
          }
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </div>
      
      <div className="absolute -bottom-8 -right-8 md:-bottom-16 md:-right-16 w-40 h-40 md:w-64 md:h-64 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
};

export default GradientSection;
