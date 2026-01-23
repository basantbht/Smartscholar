import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './index.css'
import { CollegeProvider } from "./context/CollegeContext";
import { AdminProvider } from "./context/AdminContext";
import { EventProvider } from "./context/EventContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CollegeProvider>
          <EventProvider>
            <App />
          </EventProvider>
          </CollegeProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
