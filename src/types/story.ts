
export interface Chapter {
  id: string;
  title: string;
  content: string;
  isPremium: boolean;
  coinPrice?: number; // Price in coins (1-5)
}

export interface Story {
  id: string;
  title: string;
  cover: string;
  author: string;
  synopsis: string;
  genre: string;
  tags: string[];
  datePublished: string;
  views?: number;
  likes?: number;
  chapters: Chapter[];
}

export interface StoryFormData {
  title: string;
  synopsis: string;
  genre: string;
  tags: string[];
  cover: File | null;
  chapters: {
    title: string;
    content: string;
    isPremium: boolean;
    coinPrice?: number;
  }[];
}

export interface PurchasedChapter {
  id: string;
  user_id: string;
  chapter_id: string;
  story_id: string;
  purchased_at: string;
  price_paid: number;
  updated_at?: string;
}

// This interface helps with the TypeScript type casting from Supabase
export interface SupabasePurchasedChapter {
  id: string;
  user_id: string;
  chapter_id: string;
  story_id: string;
  purchased_at: string;
  price_paid: number;
  updated_at: string;
}
