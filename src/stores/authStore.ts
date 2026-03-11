import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  email: string;
  user_id?: string;  // backward compat
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  loginWithOAuth: (provider: 'google' | 'kakao') => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: profile.id,
            user_id: profile.id,
            name: profile.name,
            bio: profile.bio || '',
            email: session.user.email || '',
          },
        });
      }
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          user: profile ? {
            id: profile.id,
            user_id: profile.id,
            name: profile.name,
            bio: profile.bio || '',
            email: session.user.email || '',
          } : null,
        });
      } else {
        set({ user: null });
      }
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);

      // If email confirmation is required
      const needsConfirmation = !data.session;
      return { needsConfirmation };
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithOAuth: async (provider: 'google' | 'kakao') => {
    const options: any = {
      redirectTo: window.location.origin + '/profile',
    };
    if (provider === 'kakao') {
      options.scopes = 'profile_nickname profile_image';
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });
    if (error) throw new Error(error.message);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
