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

// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar"; // your navbar component

// const StudentLayout = () => {
//   return (
//     <div className="h-screen flex flex-col overflow-hidden">
//       <Navbar />
//       <main className="flex-1 overflow-hidden">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default StudentLayout;