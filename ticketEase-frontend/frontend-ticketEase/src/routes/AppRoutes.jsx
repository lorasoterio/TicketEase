import { Routes, Route, Navigate } from "react-router-dom";
import DocumentRequestPage from "../pages/user/RequestTicket";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/request-document" element={<DocumentRequestPage />} />
    </Routes>
  );
}
