
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ user: User | null; session: Session | null; }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Use setTimeout to avoid Supabase auth deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        console.log('Fetched profile data:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast({
          title: "Pendaftaran gagal",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // User successfully created
      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan lengkapi profil Anda",
      });
      
      return {
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login gagal",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // User successfully signed in
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali di CeritaKita!"
      });
      
      return {
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout gagal",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // User successfully signed out
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa kembali!"
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (profileData: any) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Updating profile with data:', profileData);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update profil gagal",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Profile successfully updated
      toast({
        title: "Profil diperbarui",
        description: "Profil Anda berhasil diperbarui"
      });
      
      // Refresh the profile
      await fetchProfile(user.id);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
