import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import Universities from "./pages/Universities"
import Colleges from "./pages/Colleges"
import Courses from "./pages/Courses"
import Degrees from "./pages/Degrees"
import Admissions from "./pages/Admissions"
import Scholarships from "./pages/Scholarships"
import ChatBot from "./components/ChatBot"
import Footer from "./components/Footer"

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