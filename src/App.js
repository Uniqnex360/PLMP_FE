import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import AdminHomePage from "./components/adminFlow/HomePage";
import SuperAdminHomePage from "./components/superAdminFlow/SuperAdminHomePage";
import ProtectedRoute from "./utils/ProtectedRoute.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="*" element={<Navigate to="" />} />
        <Route path="/Admin/*" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
        <Route path="/SuperAdmin/*" element={<ProtectedRoute><SuperAdminHomePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;
