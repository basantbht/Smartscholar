import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // your navbar component

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
