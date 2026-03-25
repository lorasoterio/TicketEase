import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import AppRoutes from "./routes/AppRoutes";
export default function App() {
  useEffect(() => {
    let isMounted = true;

    async function testConnection() {
      const { data, error } = await supabase.from("tickets").select("*");

      if (!isMounted) return;

      console.log("data:", data);
      console.log("error:", error);
    }

    testConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AppRoutes />
    </>
  );
}
