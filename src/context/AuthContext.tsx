import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getStorageInfo, waitForSession, fetchProfile } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 🚨 CRITICAL: Add hard fallback timeout to force isLoading = false no matter what (5 seconds)
    const fallbackTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('⚠️ Auth still loading after 5s, forcing isLoading = false');
        setIsLoading(false);
      }
    }, 5000);

    // 🚨 Handle both /content-demo and /content-demo/ formats with normalized path check
    const path = window.location.pathname.replace(/\/$/, ''); // remove trailing slash
    if (path === '/content-demo') {
      console.log('⚠️ Skipping AuthContext init for /content-demo');
      setIsLoading(false);
      clearTimeout(fallbackTimeout); // Clear fallback since we're done
      return () => {
        mounted = false;
        clearTimeout(fallbackTimeout);
      };
    }

    // ✅ Otherwise, run full auth logic as usual
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        console.log('🔍 Storage Info:', getStorageInfo());
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('👤 Found existing session for user:', session.user.id);
          await handleUserSession(session.user, mounted);
        } else {
          console.log('👤 No existing session found');
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          console.log('✅ Auth initialization complete, setting loading to false');
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      if (session?.user && event === 'SIGNED_IN') {
        console.log('👤 User signed in, handling session...');
        await handleUserSession(session.user, mounted);
      } else if (event === 'SIGNED_OUT') {
        console.log('👤 User signed out');
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (authUser: SupabaseUser, mounted: boolean) => {
    try {
      console.log('🔍 Handling user session for:', authUser.id);
      
      // ✅ Fetch profile with retries and proper error handling
      const { data: profile, error } = await fetchProfile(authUser.id);

      if (!mounted) return;

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching user profile:', error);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (profile) {
        console.log('✅ Profile found, setting user state:', profile);
        setUser({
          id: profile.id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || authUser.email || ''
        });
      } else {
        console.log('⚠️ Profile not found for user:', authUser.id);
        console.log('ℹ️ User may be in registration process, keeping session active');
        // ✅ Don't auto-logout - profile might be created soon
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Error in handleUserSession:', error);
      if (mounted) {
        setUser(null);
      }
    } finally {
      if (mounted) {
        console.log('🏁 Setting isLoading to false');
        setIsLoading(false);
      }
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🚀 Starting registration process...', { firstName, lastName, email });
    console.log('🔍 Current storage info:', getStorageInfo());
    
    try {
      setIsLoading(true);
      
      // Step 1: Clean slate - ensure no existing session
      console.log('🧼 Performing clean slate test...');
      await supabase.auth.signOut();
      console.log('🧼 Clean slate complete, proceeding with fresh signup...');
      
      // Step 2: Sign up with Supabase Auth
      console.log('📝 Attempting Supabase auth signup...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName },
        },
      });

      console.log('📝 Signup response:', { data, error });

      if (error) {
        console.error("❌ Supabase signup error:", error.message);
        return { success: false, error: error.message };
      }

      const authUser = data.user;
      if (!authUser) {
        console.error('❌ No user returned from sign-up');
        return { 
          success: false, 
          error: 'Registration failed - no user created. Please try again.' 
        };
      }

      console.log('✅ Auth user created:', authUser.id);

      // ✅ Step 3: Wait for session to be available before proceeding
      console.log('⏳ Waiting for session to be available...');
      try {
        const session = await waitForSession(10, 250);
        console.log('✅ Session confirmed available:', !!session.access_token);
      } catch (sessionError) {
        console.error('❌ Session not available after retries:', sessionError);
        return { 
          success: false, 
          error: 'Session not available. Please try logging in.' 
        };
      }

      // Step 4: Create profile in profiles table
      console.log('📝 Creating profile in database...');
      const { data: profileData, error: profileError } = await supabase.from('profiles').insert([
        {
          id: authUser.id,
          email,
          first_name: firstName,
          last_name: lastName,
        },
      ]).select().single();

      console.log('📝 Profile creation result:', { data: profileData, error: profileError });

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message);
        return { 
          success: false, 
          error: profileError.message 
        };
      }

      if (!profileData) {
        return {
          success: false,
          error: 'Unable to complete registration. Please try again.'
        };
      }

      // Success - set user state immediately
      console.log('✅ Registration successful! Profile created:', profileData);
      setUser({
        id: authUser.id,
        firstName,
        lastName,
        email: authUser.email || email
      });
      
      console.log('🔍 Final storage info after registration:', getStorageInfo());
      
      return { success: true };

    } catch (error) {
      console.error('💥 Unexpected error during registration:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  console.log('🎯 AuthProvider state:', { 
    hasUser: !!user, 
    isAuthenticated: !!user, 
    isLoading,
    userId: user?.id,
    storageInfo: getStorageInfo()
  });

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};