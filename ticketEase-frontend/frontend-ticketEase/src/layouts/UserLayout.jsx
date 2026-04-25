import UserNavbar from "../components/navBarLayouts/UserNavbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <UserNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
