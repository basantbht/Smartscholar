import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const StudentLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default StudentLayout;
