
export const useAuth = () => {
  // Stub: always return not authenticated
  return {
    session: null,
    user: null,
    profile: null,
    loading: false,
    signUp: async () => { throw new Error('Auth disabled'); },
    signIn: async () => { throw new Error('Auth disabled'); },
    signOut: async () => { throw new Error('Auth disabled'); },
    updateProfile: async () => { throw new Error('Auth disabled'); },
  };
};
