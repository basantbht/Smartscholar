import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ adjust path if different

const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
