
// Auth logic removed: always return no purchased chapters, purchasing disabled
export const usePurchasedChapters = () => {
  return {
    purchasedChapters: [],
    isLoading: false,
    purchaseChapter: async () => false
  };
};
