import AdminNavbar from "../components/navBarLayouts/AdminNavbar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
