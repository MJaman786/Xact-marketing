import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import { OtpVerification } from "./components/Auth/OtpVerification";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp/:userId/:type" element={<OtpVerification />} />
          <Route element={<ProtectedRoutes />}>
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/admin/insights"
              element={<Product />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
