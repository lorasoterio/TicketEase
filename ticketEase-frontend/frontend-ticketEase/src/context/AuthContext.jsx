import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
// Supabase disabled — using local .NET backend instead
// import { supabase } from "../api/supabaseClient";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setProfile(parsed);

        // Fetch fresh profile data so fullName is always available
        const role = parsed.role?.toLowerCase();
        const userId = parsed.userId;
        console.log("[AuthContext] Logged-in user ID:", userId ?? "undefined", "| role:", parsed.role ?? "undefined");
        if (userId) {
          const endpoint =
            role === "staff" || role === "admin" || role === "superadmin"
              ? `/staff/user/${userId}`
              : `/student/user/${userId}`;
          client
            .get(endpoint)
            .then(({ data }) => setProfile((prev) => ({ ...prev, ...data })))
            .catch(() => {/* keep existing profile if fetch fails */})
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } catch {
        // ignore malformed data
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUser, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
