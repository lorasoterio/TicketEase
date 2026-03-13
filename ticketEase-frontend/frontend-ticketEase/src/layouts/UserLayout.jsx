import LeftNavBar from "../components/layout/LeftNavBar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
        <Outlet />

    </>
  );
}