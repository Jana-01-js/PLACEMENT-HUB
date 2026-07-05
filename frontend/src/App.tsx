import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { StudentProfilePage } from "@/pages/student/StudentProfilePage";
import { JobsBrowsePage } from "@/pages/student/JobsBrowsePage";
import { JobDetailPage } from "@/pages/student/JobDetailPage";

import { RecruiterDashboard } from "@/pages/recruiter/RecruiterDashboard";
import { CompanyProfilePage } from "@/pages/recruiter/CompanyProfilePage";
import { PostJobPage } from "@/pages/recruiter/PostJobPage";
import { MyJobsPage } from "@/pages/recruiter/MyJobsPage";

import { OfficerDashboard } from "@/pages/officer/OfficerDashboard";
import { PendingJobsPage } from "@/pages/officer/PendingJobsPage";
import { StudentDirectoryPage } from "@/pages/officer/StudentDirectoryPage";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  student: "/student",
  recruiter: "/recruiter",
  placement_officer: "/officer",
  admin: "/officer",
};

// Redirects a logged-in user hitting "/" to their dashboard; shows the
// marketing landing page to everyone else.
const RootRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to={DASHBOARD_BY_ROLE[user.role] ?? "/login"} replace />;
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allow={["student"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="jobs" element={<JobsBrowsePage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
        </Route>

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allow={["recruiter"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} />
          <Route path="company" element={<CompanyProfilePage />} />
          <Route path="jobs/new" element={<PostJobPage />} />
          <Route path="jobs" element={<MyJobsPage />} />
        </Route>

        <Route
          path="/officer"
          element={
            <ProtectedRoute allow={["placement_officer", "admin"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OfficerDashboard />} />
          <Route path="pending" element={<PendingJobsPage />} />
          <Route path="students" element={<StudentDirectoryPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
