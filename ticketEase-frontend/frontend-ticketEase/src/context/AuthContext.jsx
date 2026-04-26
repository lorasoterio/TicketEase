import { createContext, useContext, useEffect, useState } from "react";
// Supabase disabled — using local .NET backend instead
// import { supabase } from "../api/supabaseClient";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Supabase session/profile logic disabled ---
  /*
  async function fetchProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  useEffect(() => {
    // Get current session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  */

  // Load user from localStorage (set by local .NET backend login)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setProfile(parsed);
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUser, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
