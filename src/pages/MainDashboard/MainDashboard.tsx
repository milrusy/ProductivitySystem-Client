import { useEffect, useRef, useState } from "react";
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

import { NotificationBell } from "../../components/NotificationBell/NotificationBell";
import { AnalyticsDashboard } from "../AnalyticsDashboard/AnalyticsDashboard";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

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

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const chartRef = useRef<HTMLDivElement>(null);

  const isEmployee = user?.role === "Employee";

  const isAdmin = user?.role === "Admin";

  const isManager =
    user?.role === "Manager";

  const canViewGlobal =
    isAdmin || isManager;

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
  }, [
    selectedUser,
    selectedDepartment,
    startDate,
    endDate
  ]);

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
      if (startDate) {
        metricsUrl += metricsUrl.includes("?")
          ? `&startDate=${startDate}`
          : `?startDate=${startDate}`;
      }

      if (endDate) {
        metricsUrl += metricsUrl.includes("?")
          ? `&endDate=${endDate}`
          : `?endDate=${endDate}`;
      }
      const res = await api.get(metricsUrl);
      setDepartmentMetrics(res.data);
      setMetrics(null);
    }

    if (filterMode === "all") {
      setMetrics(null);
    } else {
      if (startDate) {
        metricsUrl += metricsUrl.includes("?")
          ? `&startDate=${startDate}`
          : `?startDate=${startDate}`;
      }

      if (endDate) {
        metricsUrl += metricsUrl.includes("?")
          ? `&endDate=${endDate}`
          : `?endDate=${endDate}`;
      }
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

    if (startDate) {
      trendsUrl += `startDate=${startDate}&`;
    }

    if (endDate) {
      trendsUrl += `endDate=${endDate}&`;
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
    if (!chartRef.current) return;

    const canvas = await html2canvas(
      chartRef.current
    );

    const image = canvas.toDataURL("image/png");

    const response = await api.post(
      "/reports/metrics/pdf",
      {
        chartImage: image,

        filters: {
          selectedUser,
          selectedDepartment,
          startDate: startDate || null,
          endDate: endDate || null
        }
      },
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

  const navigate = useNavigate();

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <h1>Продуктивність працівників</h1>

        <div className="headerRight">
          <div className="headerRight">
            <NotificationBell />

              <button
                className="adminBtn"
                onClick={() => {
                  window.open(
                    "https://localhost:7168/hangfire",
                    "_blank"
                  );
                }}
              >
                📈
              </button>

            {user?.role === "Admin" && (
              <button
                className="adminBtn"
                onClick={() => navigate("/admin/users")}
              >
                Керувати користувачами
              </button>
            )}

            <button
              className="adminBtn"
              onClick={() => navigate("/change-password")}
            >
              Змінити пароль
            </button>

            <button onClick={logout} className="logoutBtn">
              Вийти
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      {canViewGlobal && (
        <div className="controls">
          <div className="selectGroup">
            <label>Користувач</label>
            <select
              className="select"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setFilterMode("user");
                setSelectedDepartment("all");
              }}
            >
              <option value="all">Всі користувачі</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="selectGroup">
            <label>Відділ</label>
            <select
              className="select"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setFilterMode("department");
                setSelectedUser("all");
              }}
            >
              <option value="all">Всі відділи</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dateFilters">

            <div className="dateCard">
              <label>Дата початку</label>

              <input
                className="dateInput"
                type="date"
                value={startDate}
                onChange={e =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div className="dateCard">
              <label>Кінцева дата</label>

              <input
                className="dateInput"
                type="date"
                value={endDate}
                onChange={e =>
                  setEndDate(e.target.value)
                }
              />
            </div>

          </div>

          <div className="actions">
            <button onClick={exportReport}>Експортувати CSV</button>
            <button onClick={exportPdf}>Експортувати PDF</button>
          </div>
        </div>
      )}

      {/* KPI */}
      {filterMode !== "department" && metrics && (
        <div className="kpiRow">
          <div className="card">
            <h3>{users.find((u) => u.id.toString() === selectedUser)?.name}</h3>
            <div className="kpiRow">
              <KPIBox title="Виконані задачі" value={metrics.completedTasks} />
              <KPIBox title="Прострочені задачі" value={metrics.overdueTasks} />
              <KPIBox
                title="Середній час виконання"
                value={metrics.avgCompletionTime}
              />
              <KPIBox
                title="Оцінка продуктивності"
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
                <KPIBox title="Кількість працівників" value={d.employeesCount} />
                <KPIBox title="Завершені задачі" value={d.completedTasks} />
                <KPIBox title="Прострочені задачі" value={d.overdueTasks} />
                <KPIBox
                  title="Середня оцінка продуктивності"
                  value={d.averageProductivity}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TREND CHART */}
      <div className="card" ref={chartRef}>
        <h3>Тенденція продуктивності</h3>

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
