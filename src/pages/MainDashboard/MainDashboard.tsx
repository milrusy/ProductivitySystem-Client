import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Metrics, Trend } from "../../types/metrics";
import type { User, Department } from "../../types/common";
import { KPIBox } from "../../components/KPIBox";
import { useAuth } from "../../context/AuthContext";
import "./MainDashboard.scss";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Link } from "react-router-dom";
import { NotificationBell } from "../../components/NotificationBell/NotificationBell";
import { AnalyticsDashboard } from "../AnalyticsDashboard/AnalyticsDashboard";

export const MainDashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);

  const { user, logout } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentMetrics, setDepartmentMetrics] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "user" | "department">(
    "all",
  );

  const isEmployee = user?.role === "Employee";

  useEffect(() => {
    if (isEmployee && user) {
      setSelectedUser(user.userId.toString());
    }
  }, [user]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
    api.get("/departments").then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedUser, selectedDepartment]);

  const loadData = async () => {
    let metricsUrl = "";

    if (filterMode === "user") {
      if (selectedUser !== "all") {
        metricsUrl = `/metrics/user/${selectedUser}`;
      } else {
        metricsUrl = `/metrics/trends?`;
      }
    }

    if (filterMode === "department") {
      if (selectedDepartment !== "all") {
        metricsUrl = `/metrics/departments/${selectedDepartment}`;
      } else {
        metricsUrl = `/metrics/departments`;
      }
      const res = await api.get(metricsUrl);
      setDepartmentMetrics(res.data);
      setMetrics(null);
    }

    if (filterMode === "all") {
      setMetrics(null);
    } else {
      const metricsRes = await api.get(metricsUrl);
      const data = metricsRes.data;

      setMetrics(Array.isArray(data) ? data[0] : data);
    }

    let trendsUrl = "/metrics/trends?";

    if (filterMode === "user" && selectedUser !== "all") {
      trendsUrl += `userId=${selectedUser}`;
    }

    if (filterMode === "department" && selectedDepartment !== "all") {
      trendsUrl += `departmentId=${selectedDepartment}`;
    }

    const trendsRes = await api.get(trendsUrl);
    setTrends(trendsRes.data);
  };

  const exportReport = async () => {
    const response = await api.get("/reports/metrics/csv", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "metrics-report.csv");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportPdf = async () => {
    const response = await api.get("/reports/metrics/pdf", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "metrics-report.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  console.log(metrics);

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <h1>Employee Productivity Dashboard</h1>

        <div className="headerRight">
          <NotificationBell />

          <button onClick={logout} className="logoutBtn">
            Logout
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      {!isEmployee && (
        <div className="controls">
          <div className="selectGroup">
            <label>User</label>
            <select
              className="select"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setFilterMode("user");
                setSelectedDepartment("all");
              }}
            >
              <option value="all">All users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="selectGroup">
            <label>Department</label>
            <select
              className="select"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setFilterMode("department");
                setSelectedUser("all");
              }}
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="actions">
            <button onClick={exportReport}>Export CSV</button>
            <button onClick={exportPdf}>Export PDF</button>
          </div>
        </div>
      )}

      {/* KPI */}
      {filterMode !== "department" && metrics && (
        <div className="kpiRow">
          <div className="card">
            <h3>{users.find((u) => u.id.toString() === selectedUser)?.name}</h3>
            <div className="kpiRow">
              <KPIBox title="Completed Tasks" value={metrics.completedTasks} />
              <KPIBox title="Overdue Tasks" value={metrics.overdueTasks} />
              <KPIBox
                title="Avg Completion Time"
                value={metrics.avgCompletionTime}
              />
              <KPIBox
                title="Productivity Score"
                value={metrics.productivityScore}
              />
            </div>
          </div>
        </div>
      )}

      {filterMode === "department" && (
        <div className="kpiRow">
          {departmentMetrics.map((d) => (
            <div key={d.departmentName} className="card">
              <h3>{d.departmentName}</h3>
              <div className="kpiRow">
                <KPIBox title="Employees" value={d.employeesCount} />
                <KPIBox title="Completed" value={d.completedTasks} />
                <KPIBox title="Overdue" value={d.overdueTasks} />
                <KPIBox
                  title="Avg Productivity"
                  value={d.averageProductivity}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TREND CHART */}
      <div className="card">
        <h3>Productivity Trend</h3>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <AnalyticsDashboard />
    </div>
  );
};
