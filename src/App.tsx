import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainDashboard } from "./pages/MainDashboard/MainDashboard";
import { Login } from "./pages/Login";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminUsers } from "./pages/AdminUsers";
import { EmployeeAnalytics } from "./pages/EmployeeAnalytics/EmployeeAnalytics";
import { Alerts } from "./pages/Alerts";
import { DepartmentAnalytics } from "./pages/DepartmentAnalytics/DepartmentAnalytics";
import { TaskDistribution } from "./pages/TaskDistribution/TaskDistribution";
import { EmployeeLeaderboard } from "./pages/EmployeeLeaderboard/EmployeeLeaderboard";
import { AlertsAnalytics } from "./pages/AlertsAnalytics/AlertsAnalytics";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-leaderboard"
            element={
              <ProtectedRoute>
                <EmployeeLeaderboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics/alerts"
            element={
              <ProtectedRoute>
                <AlertsAnalytics />
              </ProtectedRoute>
            }
          />

          <Route path="/analytics/tasks" element={<TaskDistribution />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
