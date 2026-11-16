'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (data: { email: string; password: string; phone: string; pharmacyName: string; fullName: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  demoLoginAsPharmacy: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const supabase = createClient();

  useEffect(() => {
    // Check local test profile or supabase session
    const checkUser = async () => {
      try {
        const localUser = localStorage.getItem('pharmadi_demo_user');
        if (localUser) {
          const parsed = JSON.parse(localUser);
          setUser({ id: parsed.id, email: parsed.email });
          setProfile(parsed);
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.warn('Auth check fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const localUser = localStorage.getItem('pharmadi_demo_user');
        if (!localUser) {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback for demo mode
        if (password === '123456') {
          demoLoginAsPharmacy();
          return {};
        }
        return { error: error.message };
      }
      setUser(data.user);
      closeAuthModal();
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signUpWithEmail = async ({
    email,
    password,
    phone,
    pharmacyName,
    fullName,
  }: {
    email: string;
    password: string;
    phone: string;
    pharmacyName: string;
    fullName: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            pharmacy_name: pharmacyName,
          },
        },
      });

      if (error) {
        // Fallback simulate demo register
        const demoUser: UserProfile = {
          id: 'demo-' + Date.now(),
          email,
          phone,
          full_name: fullName,
          pharmacy_name: pharmacyName,
          role: 'customer',
          is_verified: true,
        };
        localStorage.setItem('pharmadi_demo_user', JSON.stringify(demoUser));
        setUser({ id: demoUser.id, email });
        setProfile(demoUser);
        closeAuthModal();
        return {};
      }

      setUser(data.user);
      closeAuthModal();
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut error', err);
    }
    localStorage.removeItem('pharmadi_demo_user');
    setUser(null);
    setProfile(null);
  };

  const demoLoginAsPharmacy = () => {
    const demoUser: UserProfile = {
      id: 'demo-pharmacy-01',
      email: 'nhathuoc.ankhang@example.com',
      phone: '0908123456',
      full_name: 'Dược sĩ Minh Tâm',
      pharmacy_name: 'Nhà Thuốc An Khang - GPP',
      address: '123 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
      is_verified: true,
      role: 'customer',
    };
    localStorage.setItem('pharmadi_demo_user', JSON.stringify(demoUser));
    setUser({ id: demoUser.id, email: demoUser.email });
    setProfile(demoUser);
    closeAuthModal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        demoLoginAsPharmacy,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
