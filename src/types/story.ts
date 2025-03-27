
export interface Chapter {
  id: string;
  title: string;
  content: string;
  isPremium: boolean;
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
  }[];
}
