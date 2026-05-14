import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Metrics, Trend } from "../types/metrics";
import type { User, Department } from "../types/common";
import { KPIBox } from "../components/KPIBox";
import { useAuth } from "../context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);

  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const isEmployee = user?.role === "Employee";

  useEffect(() => {
    if (isEmployee && user) {
      setSelectedUser(user.userId.toString());
    }
  }, [user]);

  // load filters
  useEffect(() => {
    api.get("/users")
      .then(res => setUsers(res.data));

    api.get("/departments")
      .then(res => setDepartments(res.data));
  }, []);

  // load dashboard data
  useEffect(() => {
    loadData();
  }, [selectedUser, selectedDepartment]);

  const loadData = async () => {
    // metrics only for selected user
    if (selectedUser !== "all") {
      const metricsRes = await api.get(
        `/metrics/user/${selectedUser}`
      );

      setMetrics(metricsRes.data);
    }
    else {
      setMetrics(null);
    }

    let trendsUrl = "/metrics/trends?";

    if (selectedUser !== "all") {
      trendsUrl += `userId=${selectedUser}&`;
    }

    if (selectedDepartment !== "all") {
      trendsUrl += `departmentId=${selectedDepartment}`;
    }

    const trendsRes = await api.get(trendsUrl);
    setTrends(trendsRes.data);
  };
  
  const exportReport = async () => {
    const response = await api.get(
      "/reports/metrics/csv",
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "metrics-report.csv"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const exportPdf = async () => {
    const response = await api.get(
      "/reports/metrics/pdf",
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "metrics-report.pdf"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#121212",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1>Employee Productivity Dashboard</h1>
      
      {/* Filters */}
      {!isEmployee && (
        <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "30px"
        }}
      >
        {/* User filter */}
        <div>
          <label style={{ fontWeight: 600, color: "#ccc" }}>
            User
          </label>
          <br />
          <select
            style={{
              marginTop: "8px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1e1e2f",
              color: "white",
              minWidth: "220px",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer"
            }}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">All users</option>

            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department filter */}
        <div>
          <label style={{ fontWeight: 600, color: "#ccc" }}>
            Department
          </label>
          <br />
          <select
            style={{
              marginTop: "8px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1e1e2f",
              color: "white",
              minWidth: "220px",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer"
            }}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All departments</option>

            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>)}

      <button onClick={exportReport}>
        Export Report
      </button>

      <button onClick={exportPdf}>
        Export PDF
      </button>

      {/* KPI */}
      {metrics && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          <KPIBox
            title="Completed Tasks"
            value={metrics.completedTasks}
          />

          <KPIBox
            title="Overdue Tasks"
            value={metrics.overdueTasks}
          />

          <KPIBox
            title="Avg Completion Time"
            value={metrics.avgCompletionTime}
          />

          <KPIBox
            title="Productivity Score"
            value={metrics.productivityScore}
          />
        </div>
      )}

      {/* Chart */}
      <div
        style={{
          background: "#1e1e2f",
          padding: "20px",
          borderRadius: "12px"
        }}
      >
        <h3>Productivity Trend</h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};