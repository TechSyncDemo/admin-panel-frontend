import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import AccessControl from "./pages/AccessControl";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/access-control" element={<AccessControl />} />

        {/* Handle 404 - Page Not Found */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
