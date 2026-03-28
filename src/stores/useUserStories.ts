import { create } from 'zustand';

export interface UserStory {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  tags: string[];
  coverUrl: string | null;
  chapters: { title: string; content: string }[];
  createdAt: string;
}

interface UserStoriesState {
  stories: UserStory[];
  addStory: (story: Omit<UserStory, 'id' | 'createdAt'>) => void;
}

export const useUserStories = create<UserStoriesState>((set) => ({
  stories: [],
  addStory: (story) =>
    set((state) => ({
      stories: [
        ...state.stories,
        {
          ...story,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
}));
