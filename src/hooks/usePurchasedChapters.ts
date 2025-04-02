
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PurchasedChapter, SupabasePurchasedChapter } from '@/types/story';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export const usePurchasedChapters = (userId: string | undefined, storyId: string | undefined) => {
  const [purchasedChapters, setPurchasedChapters] = useState<PurchasedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedChapters = async () => {
      if (!userId || !storyId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('purchased_chapters')
          .select('*')
          .eq('user_id', userId)
          .eq('story_id', storyId);

        if (error) {
          console.error('Error fetching purchased chapters:', error);
          toast({
            title: "Gagal mengambil data chapter",
            description: error.message,
            variant: "destructive",
          });
        } else {
          const typedData = data as unknown as SupabasePurchasedChapter[];
          setPurchasedChapters(typedData || []);
          console.log('Purchased chapters:', typedData);
        }
      } catch (err) {
        console.error('Error in purchased chapters fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedChapters();
  }, [userId, storyId]);

  const purchaseChapter = async (
    user: User, 
    userCoins: number, 
    chapterId: string, 
    storyId: string, 
    chapterPrice: number
  ) => {
    try {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ 
          coins: userCoins - chapterPrice 
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      const { error: purchaseError } = await supabase
        .from('purchased_chapters')
        .insert({
          user_id: user.id,
          chapter_id: chapterId,
          story_id: storyId,
          price_paid: chapterPrice
        });

      if (purchaseError) {
        throw purchaseError;
      }

      const { data, error: fetchError } = await supabase
        .from('purchased_chapters')
        .select('*')
        .eq('user_id', user.id)
        .eq('story_id', storyId);

      if (fetchError) {
        throw fetchError;
      }

      const typedData = data as unknown as SupabasePurchasedChapter[];
      setPurchasedChapters(typedData || []);

      toast({
        title: "Pembelian Berhasil",
        description: `Anda telah membeli chapter premium dengan ${chapterPrice} koin.`,
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error purchasing chapter:', error);
      toast({
        title: "Gagal Membeli Chapter",
        description: error.message || "Terjadi kesalahan saat membeli chapter.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    purchasedChapters,
    isLoading,
    purchaseChapter
  };
};
