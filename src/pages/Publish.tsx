import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Plus, X, Upload, Check, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { StoryFormData } from '@/types/story';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const genres = [
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

const availableTags = [
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
  'Distopia',
  'Cerita Rakyat',
  'Remaja',
  'Inspiratif',
];

const initialFormData: StoryFormData = {
  title: '',
  synopsis: '',
  genre: '',
  tags: [],
  cover: null,
  chapters: [],
};

const Publish = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<StoryFormData>(initialFormData);
  const [currentTab, setCurrentTab] = useState('info');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  
  const [formErrors, setFormErrors] = useState({
    title: false,
    synopsis: false,
    genre: false,
    cover: false,
    tags: false,
    chapterTitle: false,
    chapterContent: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isInfoComplete = 
    formData.title !== '' && 
    formData.synopsis.split(' ').length >= 25 && 
    formData.genre !== '' && 
    formData.tags.length > 0 && 
    formData.cover !== null;
  
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, cover: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormErrors({
        ...formErrors,
        cover: false
      });
    }
  };
  
  const handleCoverButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };
  
  const validateInfoTab = () => {
    const synopsisWords = formData.synopsis.split(' ').length;
    const errors = {
      title: formData.title === '',
      synopsis: synopsisWords < 25,
      genre: formData.genre === '',
      cover: formData.cover === null,
      tags: formData.tags.length === 0,
      chapterTitle: false,
      chapterContent: false,
    };
    
    setFormErrors(errors);
    
    if (!errors.title && !errors.synopsis && !errors.genre && !errors.cover && !errors.tags) {
      setCurrentTab('chapters');
      return true;
    }
    
    return false;
  };
  
  const handleContinueToChapters = () => {
    if (validateInfoTab()) {
      setCurrentTab('chapters');
    } else {
      toast({
        title: "Informasi Belum Lengkap",
        description: "Mohon lengkapi semua informasi cerita sebelum melanjutkan.",
        variant: "destructive",
      });
    }
  };
  
  const validateChapter = () => {
    const contentWords = chapterContent.split(' ').length;
    const errors = {
      ...formErrors,
      chapterTitle: chapterTitle === '',
      chapterContent: contentWords < 100,
    };
    
    setFormErrors(errors);
    
    if (!errors.chapterTitle && !errors.chapterContent) {
      return true;
    }
    
    return false;
  };
  
  const handleAddChapter = () => {
    if (validateChapter()) {
      const newChapter = {
        title: chapterTitle,
        content: chapterContent,
        isPremium: false,
        coinPrice: undefined,
      };
      
      setFormData({
        ...formData,
        chapters: [...formData.chapters, newChapter],
      });
      
      setChapterTitle('');
      setChapterContent('');
      
      toast({
        title: "Chapter Ditambahkan",
        description: `Chapter "${chapterTitle}" berhasil ditambahkan ke cerita anda.`,
      });
    } else {
      toast({
        title: "Chapter Belum Lengkap",
        description: "Judul chapter diperlukan dan isi harus minimal 100 kata.",
        variant: "destructive",
      });
    }
  };
  
  const uploadCoverImage = async (file: File) => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `story-covers/${fileName}`;
    
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading cover:', uploadError);
        return null;
      }
      
      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in cover upload:', error);
      return null;
    }
  };
  
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to publish a story",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.chapters.length === 0) {
      toast({
        title: "Tidak Dapat Menerbitkan",
        description: "Cerita harus memiliki minimal satu chapter.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublishing(true);
    
    try {
      let coverUrl = null;
      if (formData.cover) {
        coverUrl = await uploadCoverImage(formData.cover);
      }
      
      if (!coverUrl && coverPreview) {
        coverUrl = coverPreview;
      }
      
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .insert({
          title: formData.title,
          synopsis: formData.synopsis,
          genre: formData.genre,
          tags: formData.tags,
          cover_url: coverUrl,
          author_id: user.id,
          is_published: true,
        })
        .select()
        .single();
        
      if (storyError) {
        throw storyError;
      }
      
      const chaptersToInsert = formData.chapters.map((chapter, index) => ({
        title: chapter.title,
        content: chapter.content,
        story_id: storyData.id,
        chapter_number: index + 1,
        is_premium: false,
      }));
      
      const { error: chaptersError } = await supabase
        .from('chapters')
        .insert(chaptersToInsert);
        
      if (chaptersError) {
        throw chaptersError;
      }
      
      toast({
        title: "Cerita Berhasil Diterbitkan!",
        description: "Cerita anda telah berhasil diterbitkan dan kini tersedia untuk dibaca.",
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error) {
      console.error('Error publishing story:', error);
      toast({
        title: "Failed to publish",
        description: "An error occurred while publishing your story.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terbitkan Ceritamu</h1>
          <p className="text-muted-foreground mt-2">
            Bagikan karya dan imajinasimu dengan pembaca di seluruh Indonesia
          </p>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="info" disabled={currentTab !== 'info' && !isInfoComplete}>
                Informasi
              </TabsTrigger>
              <TabsTrigger value="chapters" disabled={currentTab === 'publish' || !isInfoComplete}>
                Chapter
              </TabsTrigger>
              <TabsTrigger value="publish" disabled={formData.chapters.length === 0}>
                Terbitkan
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <TabsContent value="info" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className={formErrors.title ? 'text-destructive' : ''}>
                    Judul Cerita <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="title"
                    placeholder="Masukkan judul cerita"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={formErrors.title ? 'border-destructive' : ''}
                  />
                  {formErrors.title && (
                    <p className="text-destructive text-sm mt-1">Judul cerita wajib diisi</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="synopsis" className={formErrors.synopsis ? 'text-destructive' : ''}>
                    Sinopsis <span className="text-destructive">*</span>
                  </Label>
                  <Textarea 
                    id="synopsis"
                    placeholder="Tuliskan sinopsis cerita (minimal 25 kata)"
                    value={formData.synopsis}
                    onChange={(e) => {
                      const newSynopsis = e.target.value;
                      setFormData({ ...formData, synopsis: newSynopsis });
                      if (newSynopsis.split(' ').length >= 25) {
                        setFormErrors({
                          ...formErrors,
                          synopsis: false
                        });
                      }
                    }}
                    className={`min-h-32 ${formErrors.synopsis ? 'border-destructive' : ''}`}
                  />
                  <p className={`text-sm mt-1 ${formErrors.synopsis ? 'text-destructive' : formData.synopsis.split(' ').length >= 25 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {formData.synopsis.split(' ').length} kata (minimal 25 kata)
                    {formData.synopsis.split(' ').length >= 25 && ' ✓'}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="genre" className={formErrors.genre ? 'text-destructive' : ''}>
                    Genre <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.genre} 
                    onValueChange={(value) => setFormData({ ...formData, genre: value })}
                  >
                    <SelectTrigger className={formErrors.genre ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Pilih genre cerita" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.genre && (
                    <p className="text-destructive text-sm mt-1">Pilih genre untuk cerita anda</p>
                  )}
                </div>
                
                <div>
                  <Label className={formErrors.tags ? 'text-destructive' : ''}>
                    Tags <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1">
                        {tag}
                        <X 
                          size={14} 
                          className="cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Input 
                      placeholder="Tambahkan tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className={`rounded-r-none ${formErrors.tags ? 'border-destructive' : ''}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          e.preventDefault();
                          handleAddTag(tagInput.trim());
                        }
                      }}
                    />
                    <Button 
                      onClick={() => tagInput.trim() && handleAddTag(tagInput.trim())}
                      className="rounded-l-none"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Tag populer:</p>
                    <div className="flex flex-wrap gap-1">
                      {availableTags.filter(tag => !formData.tags.includes(tag)).slice(0, 8).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-white"
                          onClick={() => handleAddTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {formErrors.tags && (
                    <p className="text-destructive text-sm mt-1">Tambahkan minimal satu tag</p>
                  )}
                </div>
                
                <div>
                  <Label className={formErrors.cover ? 'text-destructive' : ''}>
                    Cover Cerita <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div 
                      className={`relative h-40 w-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center overflow-hidden ${
                        formErrors.cover ? 'border-destructive' : 'border-border'
                      } cursor-pointer`}
                      onClick={handleCoverButtonClick}
                    >
                      {coverPreview ? (
                        <img 
                          src={coverPreview} 
                          alt="Cover preview" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Upload size={24} className="mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Upload Cover
                          </p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        id="cover" 
                        ref={fileInputRef}
                        accept="image/*" 
                        className="sr-only"
                        onChange={handleCoverUpload}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Button 
                        variant="outline" 
                        className="mb-2 w-full sm:w-auto"
                        onClick={handleCoverButtonClick}
                        type="button"
                      >
                        <Upload size={16} className="mr-2" />
                        {coverPreview ? 'Ganti Cover' : 'Upload Cover'}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground">
                        Ukuran yang disarankan: 600 x 800 pixel (3:4 ratio).<br />
                        Format yang didukung: JPG, PNG, WebP.
                      </p>
                    </div>
                  </div>
                  {formErrors.cover && (
                    <p className="text-destructive text-sm mt-1">Cover cerita wajib diupload</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleContinueToChapters}
                  className="group"
                >
                  Lanjutkan ke Chapter
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="chapters" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                <div className="bg-secondary/40 backdrop-blur-sm rounded-lg border border-border p-4">
                  <h3 className="font-medium mb-3">
                    <span>Chapter List ({formData.chapters.length})</span>
                  </h3>
                  
                  {formData.chapters.length > 0 ? (
                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 scrollbar-hidden">
                      {formData.chapters.map((chapter, index) => (
                        <Card key={index} className="bg-card/50">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Chapter {index + 1}</span>
                                </div>
                                <p className="font-medium">{chapter.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {chapter.content.split(' ').length} kata
                                </p>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    chapters: formData.chapters.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-md bg-secondary/30">
                      <FileText size={32} className="text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Belum ada chapter</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tambahkan minimal satu chapter
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chapterTitle" className={formErrors.chapterTitle ? 'text-destructive' : ''}>
                      Judul Chapter <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="chapterTitle"
                      placeholder="Masukkan judul chapter"
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      className={formErrors.chapterTitle ? 'border-destructive' : ''}
                    />
                    {formErrors.chapterTitle && (
                      <p className="text-destructive text-sm mt-1">Judul chapter wajib diisi</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="chapterContent" className={formErrors.chapterContent ? 'text-destructive' : ''}>
                      Isi Chapter <span className="text-destructive">*</span>
                    </Label>
                    <Textarea 
                      id="chapterContent"
                      placeholder="Tuliskan isi chapter (minimal 100 kata)"
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      className={`min-h-[400px] ${formErrors.chapterContent ? 'border-destructive' : ''}`}
                    />
                    <p className={`text-sm mt-1 ${formErrors.chapterContent ? 'text-destructive' : chapterContent.split(' ').length >= 100 ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {chapterContent.split(' ').length} kata (minimal 100 kata)
                      {chapterContent.split(' ').length >= 100 && ' ✓'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (isInfoComplete) {
                          setCurrentTab('info');
                        }
                      }}
                    >
                      Kembali
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAddChapter}
                        variant="outline"
                      >
                        <Plus size={16} className="mr-2" />
                        Tambah Chapter
                      </Button>
                      
                      <Button
                        onClick={() => {
                          if (formData.chapters.length > 0) {
                            setCurrentTab('publish');
                          } else {
                            toast({
                              title: "Tidak Dapat Melanjutkan",
                              description: "Tambahkan minimal satu chapter sebelum melanjutkan.",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={formData.chapters.length === 0}
                      >
                        Lanjut ke Terbitkan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="publish" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Informasi Cerita</h2>
                    <p className="text-muted-foreground">
                      Periksa kembali semua informasi cerita anda sebelum menerbitkan
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    {coverPreview && (
                      <img 
                        src={coverPreview} 
                        alt="Cover cerita" 
                        className="h-48 w-32 object-cover rounded-md border border-border"
                      />
                    )}
                    
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-semibold">{formData.title}</h3>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary hover:bg-primary/90">{formData.genre}</Badge>
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-black/40 backdrop-blur-md border-white/10 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">{formData.synopsis}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-black/20">
                          {formData.chapters.length} Chapter
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Daftar Chapter ({formData.chapters.length})</h3>
                  
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-2 scrollbar-hidden">
                    {formData.chapters.map((chapter, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md border border-border bg-secondary/20"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-black/20">
                              Chapter {index + 1}
                            </Badge>
                          </div>
                          
                          <p className="font-medium mt-1">{chapter.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {chapter.content.split(' ').length} kata
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="bg-secondary/40 backdrop-blur-sm rounded-md p-3 text-sm">
                      <p className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" /> 
                        <span>Cerita anda akan langsung tersedia untuk dibaca setelah diterbitkan</span>
                      </p>
                      <p className="flex items-center gap-2 mt-2">
                        <Check size={16} className="text-green-500" /> 
                        <span>Penulis dari cerita ini akan otomatis diatur sebagai akun anda</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentTab('chapters')}
                      >
                        Kembali
                      </Button>
                      
                      <Button 
                        onClick={handlePublish} 
                        size="lg"
                        disabled={isPublishing}
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          'Terbitkan Cerita'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Publish;
