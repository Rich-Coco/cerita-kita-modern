import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { stories } from '@/data/stories';
import StoryCard from '@/components/story/StoryCard';
import { Story } from '@/types/story';
import MainLayout from '@/components/layout/MainLayout';

const genres = [
  'Semua Genre',
  'Fiksi Fantasi',
  'Romance',
  'Techno Thriller',
  'Misteri',
  'Horor',
  'Petualangan',
  'Drama',
  'Aksi',
  'Sejarah',
];

const tags = [
  'Petualangan',
  'Misteri',
  'Keluarga',
  'Waktu',
  'Teknologi',
  'Aksi',
  'Konspirasi',
  'Futuristik',
  'Persahabatan',
  'Supernatural',
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'Semua Genre');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>(stories);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const genre = searchParams.get('genre');
    if (genre) {
      setSelectedGenre(genre);
    }
    
    const tags = searchParams.get('tags');
    if (tags) {
      setSelectedTags(tags.split(','));
    }
    
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);
  
  useEffect(() => {
    let result = [...stories];
    
    if (searchQuery) {
      result = result.filter(
        story => 
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedGenre && selectedGenre !== 'Semua Genre') {
      result = result.filter(story => story.genre === selectedGenre);
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(story => 
        selectedTags.some(tag => story.tags.includes(tag))
      );
    }
    
    setFilteredStories(result);
    
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedGenre !== 'Semua Genre') params.set('genre', selectedGenre);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    
    setSearchParams(params);
  }, [searchQuery, selectedGenre, selectedTags, setSearchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('Semua Genre');
    setSelectedTags([]);
  };
  
  return (
    <MainLayout>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Temukan Cerita</h1>
            <p className="text-muted-foreground mt-1">Cari cerita yang sesuai dengan seleramu</p>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2 md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-card rounded-lg border border-border p-5 sticky top-24 space-y-6">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari cerita, penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button type="submit" className="w-full">Cari</Button>
              </form>
              
              <div>
                <h3 className="font-medium mb-3">Genre</h3>
                <div className="space-y-2">
                  {genres.map((genre) => (
                    <div 
                      key={genre}
                      className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        selectedGenre === genre 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag) 
                          ? 'bg-primary hover:bg-primary/90'
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={resetFilters}
              >
                <X size={16} className="mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Menampilkan {filteredStories.length} cerita
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Urutkan:</span>
                <select className="bg-secondary border-border rounded-md px-3 py-1.5 text-sm">
                  <option>Terbaru</option>
                  <option>Terpopuler</option>
                  <option>Paling Disukai</option>
                </select>
              </div>
            </div>
            
            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <SearchIcon size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Tidak Ada Hasil</h3>
                <p className="text-muted-foreground max-w-md">
                  Tidak ada cerita yang sesuai dengan filter pencarian. Coba ubah kata kunci atau filter.
                </p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
