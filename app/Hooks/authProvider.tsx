'use client';

import { Session, User } from '@supabase/supabase-js';
import { useContext, useState, useEffect, createContext } from 'react';
import { createClient } from '@/utils/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }

      // Listen to auth changes (e.g., login/logout)
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      setLoading(false); // ✅ Only after session is initially fetched

      // ✅ Unsubscribe on cleanup
      return () => {
        listener?.subscription.unsubscribe();
      };
    };

    // Call the inline async function
    const cleanupPromise = initAuth();

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    signOut: () => {
      const supabase = createClient();
      supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? "Loading..." : children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => useContext(AuthContext);
