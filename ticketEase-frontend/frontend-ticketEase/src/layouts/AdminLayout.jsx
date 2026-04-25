import AdminNavbar from "../components/navBarLayouts/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
