// Auth hook stub - no authentication configured
export const useAuth = () => {
  return {
    session: null,
    user: null,
    profile: null,
    loading: false,
    signUp: async () => ({ user: null, session: null }),
    signIn: async () => ({ user: null, session: null }),
    signOut: async () => {},
    updateProfile: async () => {},
  };
};
