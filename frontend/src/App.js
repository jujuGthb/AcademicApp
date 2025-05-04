import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import CandidateLayout from "./layouts/CandidateLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import JuryLayout from "./layouts/JuryLayout";

// Public Pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import JobPostings from "./pages/public/JobPostings";
import Criteria from "./pages/public/Criteria";
import PointsTable from "./pages/public/PointsTable";
import NotFound from "./pages/public/NotFound";

// Candidate Pages

import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateActivityDetail from "./pages/candidate/ActivityDetail";
import CandidateApplicationDetails from "./pages/candidate/ApplicationDetail";
import CandidateJobPostings from "./pages/candidate/JobPostings";
import CandidateJobPostingDetails from "./pages/candidate/JobPostingDetail";
import CandidateProfile from "./pages/candidate/Profile";
import CandidateReportDetail from "./pages/candidate/ReportDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplicationDetails from "./pages/admin/ApplicationDetail";
import AdminAssignJury from "./pages/admin/AssignJury";
import AdminCriteriaManagement from "./pages/admin/CriteriaManagement";
import AdminJobPostings from "./pages/admin/JobPostingManagement";
import AdminJobPostingDetails from "./pages/admin/JobPostingDetails";
import AdminApplications from "./pages/admin/Applications";
import AdminUserManager from "./pages/admin/UserManager";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerCriteriaForm from "./pages/manager/CriteriaForm";
import ManagerJuryAssignment from "./pages/manager/JuryAssignment";

// Jury Pages
import JuryDashboard from "./pages/jury/JuryDashboard";
import JuryViewApplication from "./pages/jury/ViewApplication";
import JuryEvaluateApplication from "./pages/jury/EvaluateApplication";

// Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";

import "./App.css";
import Activities from "./pages/Activities";
import Loading from "./Loading";

function App() {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    verifyToken,
    logout,
  } = useContext(AuthContext); //user, setUser,

  //const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      //alert(token)

      if (token && storedUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      //setTimeout(() => {
        setIsLoading(false);
      //}, 1000);
    };

    if (isLoading) {
      load();
    }
  }, [isLoading]); //, user, isAuthenticated]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="job-postings" element={<JobPostings />} />
            <Route path="criteria" element={<Criteria />} />
            <Route path="points-table" element={<PointsTable />} />
          </Route>

          {/* <Route
            path="candidate"
            element={
              <ProtectedRoute allowedRoles={["applicant", "manager", "admin", "jury"]}>
                <CandidateLayout />
                </ProtectedRoute>
              }
            >
            <Route index element={<CandidateDashboard />} />
            </Route> */}
          {/* Candidate Routes */}
          <Route
            path="candidate"
            element={
              <ProtectedRoute
                allowedRoles={["applicant"]}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
              >
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CandidateDashboard />} />
            <Route path="job-postings" element={<CandidateJobPostings />} />
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route
              path="job-postings/:id"
              element={<CandidateJobPostingDetails />}
            />
            <Route
              path="applications/:id"
              element={<CandidateApplicationDetails />}
            />
            <Route path="profile" element={<CandidateProfile />} />
            <Route
              path="activities/:id"
              element={<CandidateActivityDetail />}
            />
            <Route path="activities" element={<Activities />} />
            <Route path="reports/:id" element={<CandidateReportDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="job-postings" element={<AdminJobPostings />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route
              path="job-postings/:id"
              element={<AdminJobPostingDetails />}
            />
            <Route path="applications" element={<AdminApplications />} />
            <Route
              path="applications/:id"
              element={<AdminApplicationDetails />}
            />

            <Route path="criteria" element={<AdminCriteriaManagement />} />
            <Route path="users" element={<AdminUserManager />} />
            <Route path="assign-jury/:id" element={<AdminAssignJury />} />
          </Route>

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute
                allowedRoles={["manager"]}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
              >
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path="criteria-form" element={<ManagerCriteriaForm />} />
            <Route path="jury-assignment" element={<ManagerJuryAssignment />} />
          </Route>

          {/* Jury Routes */}
          <Route
            path="/jury"
            element={
              <ProtectedRoute
                allowedRoles={["jury"]}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
              >
                <JuryLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JuryDashboard />} />
            <Route path="applications/:id" element={<JuryViewApplication />} />
            <Route path="evaluate/:id" element={<JuryEvaluateApplication />} />
            <Route path="view/:id" element={<JuryEvaluateApplication />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
