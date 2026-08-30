import { Routes, Route } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import MembershipPage from "@/pages/MembershipPage";
import ApplyPage from "@/pages/ApplyPage";
import VerifyPage from "@/pages/VerifyPage";
import PrivacyNoticePage from "@/pages/PrivacyNoticePage";
import TermsPage from "@/pages/TermsPage";
import MemberLoginPage from "@/pages/MemberLoginPage";
import MemberPortalPage from "@/pages/MemberPortalPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify/:membershipNumber" element={<VerifyPage />} />
          <Route path="/privacy-notice" element={<PrivacyNoticePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/member-login" element={<MemberLoginPage />} />
          <Route path="/portal" element={<MemberPortalPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
