import { Routes, Route, Navigate } from "react-router-dom";
// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";

// Student pages
import StudentDashboard from "../pages/user/Dashboard";
import RequestTicket from "../pages/user/RequestTicket";
import MyTickets from "../pages/user/MyTickets";
import TrackStatus from "../pages/user/TrackStatus";
import Profile from "../pages/user/Profile";
import UserRegisterPage from "../pages/user/RegisterPage";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminRegisterPage from "../pages/admin/RegisterPage";
import AdminManageUsers from "../pages/admin/ManageUsers";
import AdminTicketQueue from "../pages/admin/TicketQueue";
import Tickets from "../pages/admin/AllTickets";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";
import VerifyStudents from "../pages/admin/VerifyStudents";
import AdminProfile from "../pages/admin/AdminProfile";
import AuditLogs from "../pages/admin/AuditLogs";

// SuperAdmin pages
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import SuperAdminManageAdmins from "../pages/admin/ManageUsers";
import SuperAdminActivityLog from "../pages/admin/AuditLogs";
import SuperAdminStudents from "../pages/admin/VerifyStudents";
import SuperAdminAllTickets from "../pages/admin/AllTickets";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth — no layout wrapper */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin/register" element={<AdminRegisterPage />} />
      <Route path="/user/register" element={<UserRegisterPage />} />

      {/* Student routes — wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/user/dashboard" element={<StudentDashboard />} />
        <Route path="/user/request-ticket" element={<RequestTicket />} />
        <Route path="/user/my-tickets" element={<MyTickets />} />
        <Route path="/user/track-status" element={<TrackStatus />} />
        <Route path="/user/profile" element={<Profile />} />
      </Route>

      {/* Admin routes — wrapped in AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/queue" element={<AdminTicketQueue />} />
        <Route path="/admin/tickets" element={<Tickets />} />
        <Route path="/admin/manage-users" element={<AdminManageUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/verify-students" element={<VerifyStudents />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
      </Route>

      {/* SuperAdmin routes — wrapped in SuperAdminLayout */}
      <Route element={<SuperAdminLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/manage-admins" element={<SuperAdminManageAdmins />} />
        <Route path="/superadmin/students" element={<SuperAdminStudents />} />
        <Route path="/superadmin/all-tickets" element={<SuperAdminAllTickets />} />
        <Route path="/superadmin/activity-log" element={<SuperAdminActivityLog />} />
      </Route>
    </Routes>
  );
}
