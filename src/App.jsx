import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./client/Dashboard";
import CategoryPage from "./client/CategoryPage";
import AdminDashboard from "./client/adminDashboard";
import AdminLogin from "./client/AdminLogin";
import Booking from "./client/Booking";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/book" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
