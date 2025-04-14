"use client";

import { Session, User } from '@supabase/supabase-js';
import { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
  loading: true,
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to manually refresh the session
  const refreshSession = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (!error) {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // Fetch the current session on mount
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Clean up the listener on component unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    session,
    user,
    signOut,
    loading,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => useContext(AuthContext);