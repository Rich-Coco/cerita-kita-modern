// Stub - no database configured
export const usePurchasedChapters = (_userId?: string, _storyId?: string) => {
  return {
    purchasedChapters: [],
    isLoading: false,
    purchaseChapter: async () => false,
  };
};
