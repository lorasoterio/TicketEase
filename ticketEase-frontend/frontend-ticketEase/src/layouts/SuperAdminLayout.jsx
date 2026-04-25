import SuperAdminNavbar from "../components/navBarLayouts/SuperAdminNavbar";
import { Outlet } from "react-router-dom";

export default function SuperAdminLayout() {
  return (
    <div>
      <SuperAdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
