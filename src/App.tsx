import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NewLogin from "./pages/NewLogin";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import NewSettings from "./pages/NewSettings";
import VisionTest from "./pages/VisionTest";
import VisionCalibration from "./pages/VisionCalibration";
import ApplyPrescription from "./pages/ApplyPrescription";
import SelectPlan from "./pages/SelectPlan";
import NewSelectPlan from "./pages/NewSelectPlan";
import More from "./pages/More";
import NewMore from "./pages/NewMore";
import Homepage from "./pages/Homepage";
import ContentDemo from "./pages/ContentDemo";
import LandingPage from "./pages/LandingPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import { CameraAccommodationTest } from "./components/CameraAccommodationTest";
import { CameraReadinessTest } from "./components/CameraReadinessTest";
import { CameraAccommodationSystem } from "./components/CameraAccommodationSystem";
import { supabase } from "./lib/supabase";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#eaf1fd] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Dev-only session reset button
const DevResetButton = () => {
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  const handleReset = () => {
    console.log("🔄 DEV: Starting session reset...");

    // Simple, synchronous reset approach
    try {
      // 1. Clear localStorage
      localStorage.clear();
      console.log("✅ localStorage cleared");
    } catch (e) {
      console.log("⚠️ localStorage clear failed:", e);
    }

    try {
      // 2. Clear sessionStorage
      sessionStorage.clear();
      console.log("✅ sessionStorage cleared");
    } catch (e) {
      console.log("⚠️ sessionStorage clear failed:", e);
    }

    try {
      // 3. Clear cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      console.log("✅ Cookies cleared");
    } catch (e) {
      console.log("⚠️ Cookie clear failed:", e);
    }

    // 4. Sign out from Supabase (fire and forget)
    supabase.auth
      .signOut()
      .catch((e) => console.log("⚠️ Supabase signout failed:", e));

    // 5. Force immediate navigation to register page
    console.log("🔄 Redirecting to register page...");
    window.location.href = "/register";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleReset}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors shadow-lg"
        title="Dev Only: Reset Session & Reload"
      >
        🔄 Reset Session
      </button>
    </div>
  );
};

// Dev-only bypass auth button
const DevBypassAuthButton = () => {
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  const handleBypass = () => {
    // Navigate directly to welcome page
    window.location.href = "/welcome-dev";
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleBypass}
        className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-lg"
        title="Dev Only: Skip to Welcome Screen"
      >
        🚀 Skip to Welcome
      </button>
    </div>
  );
};

function AppContent() {
  const { isLoading, isAuthenticated, user } = useAuth();

  console.log("🎯 App routing state:", {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
  });

  // ✅ DEV ONLY: Check if we're accessing the dev welcome route
  if (import.meta.env.DEV && window.location.pathname === "/welcome-dev") {
    return (
      <div className="min-h-screen bg-[#eaf1fd]">
        <Routes>
          <Route path="/welcome-dev" element={<Welcome />} />
          <Route path="/vision-test" element={<VisionTest />} />
          <Route path="/vision-calibration" element={<VisionCalibration />} />
          <Route path="/apply-prescription" element={<ApplyPrescription />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-settings" element={<NewSettings />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/new-select-plan" element={<NewSelectPlan />} />
          <Route path="/more" element={<More />} />
          <Route path="/new-more" element={<NewMore />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/content-demo" element={<ContentDemo />} />
          <Route path="/demo" element={<ContentDemo />} />
          <Route path="/camera-test" element={<CameraAccommodationTest />} />
          <Route path="/camera-readiness" element={<CameraReadinessTest />} />
          <Route path="/camera-system" element={<CameraAccommodationSystem />} />
          <Route path="/new-login" element={<NewLogin />} />
          <Route path="*" element={<Navigate to="/welcome-dev" replace />} />
        </Routes>
        <DevResetButton />
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium">
            🔧 DEV MODE - Auth Bypassed
          </div>
        </div>
      </div>
    );
  }

  // ✅ 1. Show loading screen while isLoading is true (with timeout protection)
  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
        <DevResetButton />
        <DevBypassAuthButton />
      </>
    );
  }

  // ✅ 2. If authenticated (regardless of user profile status), show protected routes
  if (isAuthenticated) {
    console.log("✅ User authenticated, showing protected routes");
    return (
      <div className="min-h-screen bg-[#eaf1fd]">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route
            path="/register"
            element={<Navigate to="/welcome" replace />}
          />
          <Route path="/login" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-settings" element={<NewSettings />} />
          <Route path="/vision-test" element={<VisionTest />} />
          <Route path="/vision-calibration" element={<VisionCalibration />} />
          <Route path="/apply-prescription" element={<ApplyPrescription />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/new-select-plan" element={<NewSelectPlan />} />
          <Route path="/more" element={<More />} />
          <Route path="/new-more" element={<NewMore />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/content-demo" element={<ContentDemo />} />
          <Route path="/demo" element={<ContentDemo />} />
          <Route path="/camera-test" element={<CameraAccommodationTest />} />
          <Route path="/camera-readiness" element={<CameraReadinessTest />} />
          <Route path="/camera-system" element={<CameraAccommodationSystem />} />
          <Route path="/new-login" element={<NewLogin />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
        <DevResetButton />
      </div>
    );
  }

  // ✅ 3. If not authenticated, show public routes (including landing page and legal pages)
  console.log("👤 User not authenticated, showing public routes");
  return (
    <div className="min-h-screen bg-[#eaf1fd]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-login" element={<NewLogin />} />
        <Route path="/new-select-plan" element={<NewSelectPlan />} />
        <Route path="/vision-calibration" element={<VisionCalibration />} />
        <Route path="/content-demo" element={<ContentDemo />} />
        <Route path="/demo" element={<ContentDemo />} />
        <Route path="/camera-test" element={<CameraAccommodationTest />} />
        <Route path="/camera-readiness" element={<CameraReadinessTest />} />
        <Route path="/camera-system" element={<CameraAccommodationSystem />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DevResetButton />
      <DevBypassAuthButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
