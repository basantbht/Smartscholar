// layouts/CollegeLayout.jsx
import { Outlet } from "react-router-dom";
import CollegeNavbar from "../components/college/CollegeNavbar";
import CollegeSidebar from "../components/college/CollegeSidebar";

export default function CollegeLayout() {
  return (
    <div className="flex min-h-screen">
      <CollegeSidebar />
      <div className="flex-1">
        <CollegeNavbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
