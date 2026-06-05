import SuperAdminNavbar from "../components/navBarLayouts/SuperAdminNavbar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function SuperAdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <SuperAdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
