import { Route, Routes } from "react-router-dom"
import Home from "./pages/User/Home"
import Register from "./pages/User/Register"
import Navbar from "./components/Navbar"
import Universities from "./pages/User/Universities"
import Colleges from "./pages/User/Colleges"
import Courses from "./pages/User/Courses"
import Degrees from "./pages/User/Degrees"
import Admissions from "./pages/User/Admissions"
import Scholarships from "./pages/User/Scholarships"
import ChatBot from "./components/ChatBot"
import Footer from "./components/Footer"
import Login from "./pages/User/Login"

const App = () => {
  return (
    <div className="mr-20 ml-20">

      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />

        <Route
          path='/register'
          element={<Register />}
        />

        <Route
          path='/login'
          element={<Login />}
        />

        <Route path="/universities" element={<Universities />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/degrees" element={<Degrees />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/scholarships" element={<Scholarships />} />

      </Routes>
      <ChatBot />
      <Footer />
    </div>
  )
}

export default App