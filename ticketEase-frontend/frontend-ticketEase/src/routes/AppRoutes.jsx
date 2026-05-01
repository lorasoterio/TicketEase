import { Routes, Route, Navigate } from "react-router-dom";
// Layouts
import UserLayout       from "../layouts/UserLayout";
import AdminLayout      from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// Auth pages
import LoginPage    from "../pages/auth/LoginPage";


// Student pages
import StudentDashboard from "../pages/user/Dashboard";
import RequestTicket from "../pages/user/RequestTicket";
import MyTickets from "../pages/user/MyTickets";
import TrackStatus from "../pages/user/TrackStatus";
import Profile from "../pages/user/Profile";
import UserRegisterPage from "../pages/user/RegisterPage";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminDashboard2 from "../pages/admin/Dashboard2";
import AdminRegisterPage from "../pages/admin/RegisterPage";
import AdminRegisterPage2 from "../pages/admin/RegisterPage2";
import AllTickets2 from "../pages/admin/AllTickets2";
import Reports2 from "../pages/admin/Reports2";
import Settings2 from "../pages/admin/Settings2";
import TicketQueue2 from "../pages/admin/TicketQueue2";

// SuperAdmin pages
import SuperAdminDashboard from "../pages/superadmin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth — no layout wrapper */}
      <Route path="/login"    element={<LoginPage />} />

      <Route path="/admin/register" element={<AdminRegisterPage />} />
      <Route path="/user/register" element={<UserRegisterPage />} />

      {/* Student routes — wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard"        element={<StudentDashboard />} />
        <Route path="/request-ticket" element={<RequestTicket />} />
        <Route path="/my-tickets"      element={<MyTickets />} />
        <Route path="/track-status"     element={<TrackStatus />} />
        <Route path="/profile"          element={<Profile />} />
      </Route>

      {/* Admin routes — wrapped in AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard2" element={<AdminDashboard2 />} />
        <Route path="/admin/register2" element={<AdminRegisterPage2 />} />
        <Route path="/admin/all-tickets2" element={<AllTickets2 />} />
        <Route path="/admin/reports2" element={<Reports2 />} />
        <Route path="/admin/settings2" element={<Settings2 />} />
        <Route path="/admin/ticket-queue2" element={<TicketQueue2 />} />
      </Route>

      {/* SuperAdmin routes — wrapped in SuperAdminLayout */}
      <Route element={<SuperAdminLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      </Route>

    </Routes>
  );
}
