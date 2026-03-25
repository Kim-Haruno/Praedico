import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  userRole: "job_seeker" | "employer" | "admin" | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"job_seeker" | "employer" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (user: User) => {
    try {
      // 1. Check user metadata first (newest/fastest)
      const metadataRole = user.user_metadata?.role;
      if (metadataRole && ["job_seeker", "employer", "admin"].includes(metadataRole)) {
        setUserRole(metadataRole as any);
        return;
      }

      // 2. Check profiles table (canonical)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (profileData?.role) {
        setUserRole(profileData.role as any);
        return;
      }

      // 3. Fallback to user_roles table
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setUserRole((roleData?.role as any) || null);
    } catch (error) {
      console.error("Error fetching role:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // First load the current session securely
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session fetch error:", error);
          // Auto-clear stale supabase storage tokens
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
          });
        }

        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchRole(session.user);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeSession();

    // Then listen for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Calling supabase.auth.signOut()...");
      setLoading(true);
      await supabase.auth.signOut();
      console.log("Signout complete.");
    } catch (error) {
      console.error("Signout failed:", error);
    } finally {
      // Always forcibly flush auth tokens from storage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      });
      setUser(null);
      setUserRole(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
