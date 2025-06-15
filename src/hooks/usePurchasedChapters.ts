
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
    console.log('Purchase chapter with params:', {
      userId: user.id,
      userCoins,
      chapterId,
      storyId,
      chapterPrice
    });

    try {
      // Insert the purchase record
      const purchaseData = {
        user_id: user.id,
        chapter_id: chapterId,
        story_id: storyId,
        price_paid: chapterPrice
      };
      
      console.log('Inserting purchase record:', purchaseData);
      
      const { error: purchaseError } = await supabase
        .from('purchased_chapters')
        .insert(purchaseData);

      if (purchaseError) {
        console.error('Error in purchase insert:', purchaseError);
        throw purchaseError;
      }

      // Fetch the updated purchased chapters list
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
        title: "Akses Diberikan",
        description: "Anda telah diberikan akses ke chapter premium.",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error purchasing chapter:', error);
      toast({
        title: "Gagal Mengakses Chapter",
        description: error.message || "Terjadi kesalahan saat mengakses chapter.",
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
