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
  sendEmailVerification
} from "firebase/auth";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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

      const { ghostPassword, error: syncError } = await response.json();
      
      if (ghostPassword) {
        // 2. Sign into Supabase with the Ghost Password
        const { data: { session: supabaseSession }, error: loginError } = 
          await supabase.auth.signInWithPassword({ 
            email: fUser.email!, 
            password: ghostPassword 
          });

        if (supabaseSession) {
          setSession(supabaseSession);
          setUser(supabaseSession.user);
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
        if (fUser.emailVerified) {
          await syncWithSupabase(fUser);
        } else {
          // User is logged into Firebase but not verified
          setLoading(false);
        }
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
      if (!userCredential.user.emailVerified) {
        return { error: "Please verify your email before signing in." };
      }
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
    <AuthContext.Provider value={{ user, firebaseUser, session, loading, signUp, signIn, signOut }}>
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
