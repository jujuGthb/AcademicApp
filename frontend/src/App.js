import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import CandidateLayout from "./layouts/CandidateLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import JuryLayout from "./layouts/JuryLayout";

// Public Pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import PointsTable from "./pages/public/PointsTable";
import Criteria from "./pages/public/Criteria";
import NotFound from "./pages/public/NotFound";

// Candidate Pages
import Dashboard from "./pages/candidate/Dashboard";
import JobPostings from "./pages/candidate/JobPostings";
import ActivityDetail from "./pages/candidate/ActivityDetail";
import ReportDetail from "./pages/candidate/ReportDetail";
import ApplicationDetail from "./pages/candidate/ApplicationDetail";
import Profile from "./pages/candidate/Profile";

// Protected Route
import ProtectedRoute from "./components/common/ProtectedRoute";

// Import other pages as needed

import "./App.css";
import { useContext, useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { token, user } = useContext(AuthContext);
  useEffect(() => {
    console.log("éok");
    let user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    user = JSON.parse(user);
    //console.log(user);
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, [user, token]);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/points-table" element={<PointsTable />} />
          <Route path="/criteria" element={<Criteria />} />
        </Route>

        {/* Candidate Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["candidate"]}
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <Route element={<CandidateLayout />}>
            <Route path="/candidate/dashboard" element={<Dashboard />} />
            <Route
              path="/candidate/activities"
              element={<div>Activities</div>}
            />
            <Route
              path="/candidate/activities/:id"
              element={<ActivityDetail />}
            />
            <Route path="/candidate/job-postings" element={<JobPostings />} />
            <Route
              path="/candidate/applications"
              element={<div>Applications</div>}
            />
            <Route
              path="/candidate/applications/:id"
              element={<ApplicationDetail />}
            />
            <Route path="/candidate/reports" element={<div>Reports</div>} />
            <Route path="/candidate/reports/:id" element={<ReportDetail />} />
            <Route path="/candidate/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<div>Admin Dashboard</div>}
            />
            <Route path="/admin/users" element={<div>Users</div>} />
            <Route
              path="/admin/job-postings"
              element={<div>Job Postings</div>}
            />
            <Route
              path="/admin/applications"
              element={<div>Applications</div>}
            />
            <Route path="/admin/criteria" element={<div>Criteria</div>} />
            <Route path="/admin/settings" element={<div>Settings</div>} />
          </Route>
        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route element={<ManagerLayout />}>
            <Route
              path="/manager/dashboard"
              element={<div>Manager Dashboard</div>}
            />
            <Route
              path="/manager/applications"
              element={<div>Applications</div>}
            />
            <Route
              path="/manager/jury-assignments"
              element={<div>Jury Assignments</div>}
            />
            <Route
              path="/manager/evaluations"
              element={<div>Evaluations</div>}
            />
            <Route path="/manager/reports" element={<div>Reports</div>} />
          </Route>
        </Route>

        {/* Jury Routes */}
        <Route element={<ProtectedRoute allowedRoles={["jury"]} />}>
          <Route element={<JuryLayout />}>
            <Route path="/jury/dashboard" element={<div>Jury Dashboard</div>} />
            <Route path="/jury/evaluations" element={<div>Evaluations</div>} />
            <Route
              path="/jury/completed"
              element={<div>Completed Evaluations</div>}
            />
            <Route path="/jury/profile" element={<div>Profile</div>} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
