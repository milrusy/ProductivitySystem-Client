import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainDashboard } from "./pages/MainDashboard/MainDashboard";
import { Login } from "./pages/Login/Login";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminUsers } from "./pages/AdminUsers/AdminUsers";
import { EmployeeAnalytics } from "./pages/EmployeeAnalytics/EmployeeAnalytics";
import { Alerts } from "./pages/Alerts";
import { DepartmentAnalytics } from "./pages/DepartmentAnalytics/DepartmentAnalytics";
import { TaskDistribution } from "./pages/TaskDistribution/TaskDistribution";
import { EmployeeLeaderboard } from "./pages/EmployeeLeaderboard/EmployeeLeaderboard";
import { AlertsAnalytics } from "./pages/AlertsAnalytics/AlertsAnalytics";
import { ChangePasswordPage } from "./pages/ChangePassword/ChangePassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["Admin"]}
              />
            }>
              <Route
                path="/admin/users"
                element={<AdminUsers />}
              />
          </Route>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Manager"
                ]}
              />
            }
          >
            <Route
              path="/departments"
              element={<DepartmentAnalytics />}
            />

            <Route
              path="/analytics/tasks"
              element={<TaskDistribution />}
            />

            <Route
              path="/employee-leaderboard"
              element={<EmployeeLeaderboard />}
            />

            <Route
              path="/analytics/alerts"
              element={<AlertsAnalytics />}
            />
          </Route>

          <Route path="/analytics/tasks" element={<TaskDistribution />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/employees/:id" element={<EmployeeAnalytics />} />
          </Route>

          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
