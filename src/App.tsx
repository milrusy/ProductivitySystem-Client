import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminUsers } from "./pages/AdminUsers";
import { EmployeeAnalytics } from "./pages/EmployeeAnalytics";
import { Alerts } from "./pages/Alerts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public route */}
          <Route
            path="/login"
            element={<Login />}
          />

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

          {/* Protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
