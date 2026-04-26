"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { auth as firebaseAuth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  session: Session | null;
  loading: boolean;
  role: 'user' | 'admin';
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(true);

  // Sync Firebase user to Supabase
  const syncWithSupabase = useCallback(async (fUser: FirebaseUser) => {
    try {
      // 1. Get the secure Ghost Password from our API
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: fUser.email, 
          uid: fUser.uid,
          idToken: await fUser.getIdToken() 
        }),
      });

      const { ghostPassword } = await response.json();
      
      if (ghostPassword) {
        // 2. Sign into Supabase with the Ghost Password
        const { data: { session: supabaseSession } } = 
          await supabase.auth.signInWithPassword({ 
            email: fUser.email!, 
            password: ghostPassword 
          });

        if (supabaseSession) {
          setSession(supabaseSession);
          setUser(supabaseSession.user);

          // 3. Fetch Role from Profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', supabaseSession.user.id)
            .single();
          
          if (profile) setRole(profile.role as 'user' | 'admin');
        }
      }
    } catch (err) {
      console.error("Auth Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Listen to Firebase Auth
    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        // BYPASS: Sync even if not verified for now
        await syncWithSupabase(fUser);
      } else {
        // Logged out of Firebase, must log out of Supabase
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    // 2. Initial Supabase check (for page refreshes)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeFirebase();
    };
  }, [syncWithSupabase]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await sendEmailVerification(userCredential.user);
      return { error: null }; // Success - will show "Check your email"
    } catch (error: any) {
      return { error: error.message };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      // BYPASS: Allowing login without verification for now
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth);
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, session, loading, role, signUp, signIn, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
