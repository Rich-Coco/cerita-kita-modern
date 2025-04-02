
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BookOpen, TrendingUp, Bookmark } from 'lucide-react';
import { stories } from '@/data/stories';
import StoryCard from '@/components/story/StoryCard';
import GenreCard from '@/components/home/GenreCard';
import GradientSection from '@/components/home/GradientSection';
import MainLayout from '@/components/layout/MainLayout';

const genres = [
  { 
    title: 'Fiksi Fantasi', 
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=1469', 
    count: 84 
  },
  { 
    title: 'Romance', 
    image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1506', 
    count: 125 
  },
  { 
    title: 'Techno Thriller', 
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070', 
    count: 52 
  },
  { 
    title: 'Misteri', 
    image: 'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?q=80&w=1469', 
    count: 73 
  },
  { 
    title: 'Horor', 
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=1470', 
    count: 48 
  },
  { 
    title: 'Petualangan', 
    image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1470', 
    count: 91 
  },
];

const Home = () => {
  const featuredStoryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (featuredStoryRef.current) {
      observer.observe(featuredStoryRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <MainLayout>
      {/* Hero section - reduced top padding further and made closer to header */}
      <section className="bg-gradient-to-b from-black to-background">
        <div className="relative px-4 md:px-6 py-4 md:py-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
          
          <div className="relative flex justify-center items-center">
            <div className="space-y-6 text-center max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-sm text-muted-foreground bg-secondary">
                <TrendingUp size={14} className="mr-1 text-primary" />
                Platform Cerita Modern Indonesia
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Temukan Dunia
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Penuh Cerita
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Baca dan terbitkan cerita dalam berbagai genre. Jelajahi imajinasi tanpa batas dari penulis Indonesia langsung dari perangkatmu.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/search">
                    Mulai Membaca <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/publish">
                    <BookOpen size={16} className="mr-2" /> Terbitkan Cerita
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Added py-10 padding below the top section (reduced from py-20) */}
      <div className="py-10"></div>
      
      {/* Featured story highlight - reduced top padding to make it closer to hero section */}
      <section className="px-4 md:px-6 py-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Sorotan Istimewa</h2>
          <p className="text-muted-foreground mt-1">Pilihan editor untuk dibaca minggu ini</p>
        </div>
        
        <div>
          {/* Featured story card that takes full width now */}
          <StoryCard story={stories[0]} variant="featured" />
        </div>
      </section>
      
      {/* Genres section - reduced top padding */}
      <section className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Jelajahi Genre</h2>
            <p className="text-muted-foreground mt-1">Temukan cerita berdasarkan kategori favoritmu</p>
          </div>
          
          <Button variant="link" asChild>
            <Link to="/search" className="flex items-center gap-1">
              Semua Genre <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <GenreCard 
              key={genre.title}
              title={genre.title}
              image={genre.image}
              count={genre.count}
            />
          ))}
        </div>
      </section>
      
      {/* Join community section - reduced top padding */}
      <section className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradientSection 
            title="Bergabunglah dengan Komunitas Penulis Kami"
            description="Terbitkan ceritamu dan bagikan dengan pembaca di seluruh Indonesia. Dapatkan umpan balik, bangun pengikut, dan kembangkan gayamu."
            buttonText="Mulai Menulis"
            buttonLink="/publish"
            gradient="primary"
          />
          
          <GradientSection 
            title="Cari Cerita yang Sesuai Seleramu"
            description="Gunakan fitur pencarian kami untuk menemukan cerita berdasarkan genre, tag, atau kata kunci. Ada ribuan cerita yang menunggumu."
            buttonText="Cari Cerita"
            buttonLink="/search"
            gradient="secondary"
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
