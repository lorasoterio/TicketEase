import UserNavbar from "../components/navBarLayouts/UserNavbar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function UserLayout() {
  const { user, profile, loading } = useAuth();
  const role = (user?.role ?? user?.Role ?? "").toString().toLowerCase();
  const isVerified =
    profile?.isVerified ??
    profile?.IsVerified ??
    user?.isVerified ??
    user?.IsVerified;

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "student") {
    if (role === "staff" || role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "superadmin") return <Navigate to="/superadmin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  if (isVerified !== true) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <UserNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
