import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout       from "../layouts/UserLayout";
import AdminLayout      from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// Auth pages
import LoginPage    from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Student pages
import StudentDashboard from "../pages/user/Dashboard";
import DocumentRequestPage from "../pages/user/RequestTicket";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";

// SuperAdmin pages
import SuperAdminDashboard from "../pages/superadmin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth — no layout wrapper */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student routes — wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard"        element={<StudentDashboard />} />
        <Route path="/request-document" element={<DocumentRequestPage />} />
      </Route>

      {/* Admin routes — wrapped in AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* SuperAdmin routes — wrapped in SuperAdminLayout */}
      <Route element={<SuperAdminLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      </Route>

    </Routes>
  );
}