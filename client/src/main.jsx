import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './index.css'
import { CollegeProvider } from "./context/CollegeContext";
import { AdminProvider } from "./context/AdminContext";
import { EventProvider } from "./context/EventContext";
import { UserProvider } from "./context/UserContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";
import { CourseProvider } from "./context/CourseContext";
import { SubscribeProvider } from "./context/SubscribeContext";

ReactDOM.createRoot(document.getElementById("root")).render(

  <BrowserRouter>
    <AuthProvider>
      <AdminProvider>
        <CollegeProvider>
          <UserProvider>
            <EventProvider>
              <ScholarshipProvider>
                <CourseProvider>
                  <SubscribeProvider>
                  <App />
                  </SubscribeProvider>
                </CourseProvider>
              </ScholarshipProvider>
            </EventProvider>
          </UserProvider>
        </CollegeProvider>
      </AdminProvider>
    </AuthProvider>
  </BrowserRouter>

);
