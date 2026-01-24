import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeProvider";
import RootLayout from "./layouts/RootLayout";
import RoleSelection from "./pages/landing/RoleSelection";
import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReportExport from "./pages/admin/ReportExport";
import UserDashboard from "./pages/user/Dashboard";
import "./styles/globals.css";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="report-export" element={<AdminReportExport />} />
        </Route>

        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
