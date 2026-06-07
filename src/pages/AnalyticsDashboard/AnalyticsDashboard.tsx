import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./AnalyticsDashboard.scss";
import type {
  DepartmentAnalytics,
  TaskDistribution,
  TopEmployee,
} from "../../types/metrics";

export const AnalyticsDashboard = () => {
  const [departments, setDepartments] = useState<DepartmentAnalytics[]>([]);
  const [tasks, setTasks] = useState<TaskDistribution | null>(null);
  const [topEmployees, setTopEmployees] = useState<TopEmployee[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/analytics/departments").then((res) => setDepartments(res.data));

    api.get("/analytics/task-distribution").then((res) => setTasks(res.data));

    api
      .get("/metrics/employees")
      .then((res) => setTopEmployees(res.data.slice(0, 10)));

    api.get("/alerts").then((res) => setAlerts(res.data));
  }, []);

  const pieData = tasks
    ? [
        { name: "Completed", value: tasks.completed },
        { name: "Overdue", value: tasks.overdue },
        { name: "In Progress", value: tasks.inProgress },
      ]
    : [];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  const criticalAlerts = alerts.filter((a) => a.severity === "Critical").length;

  const warningAlerts = alerts.filter((a) => a.severity === "Warning").length;

  return (
    <div className="analyticsPage">
      <h1>Аналітична панель</h1>

      {/* KPI STYLE SECTION */}
      <div className="grid">
        {/* DEPARTMENTS BAR */}
        <div
          className="card clickable"
          onClick={() => navigate("/departments")}
        >
          <h3>
            Статистика за відділами
            <p style={{ opacity: 0.5, fontSize: 12 }}>(натиснути для деталей)</p>
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departments}>
              <XAxis dataKey="departmentName" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="averageProductivity" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div
          className="card clickable"
          onClick={() => navigate("/analytics/tasks")}
        >
          <h3>
            Розподіл задач
            <p style={{ opacity: 0.5, fontSize: 12 }}>(натиснути для деталей)</p>
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* TOP EMPLOYEES */}
        <div
          className="card clickable"
          onClick={() => navigate("/employee-leaderboard")}
        >
          <h3>
            Рейтинг працівників
            <p style={{ opacity: 0.5, fontSize: 12 }}>(натиснути для деталей)</p>
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEmployees} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />

              <Bar dataKey="productivityScore" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ALERTS */}
        <div
          className="card clickable"
          onClick={() => navigate("/analytics/alerts")}
        >
          <h3>
            Сповіщення та Ризики
            <p style={{ opacity: 0.5, fontSize: 12 }}>(натиснути для деталей)</p>
          </h3>

          <div className="alertsPreview">
            <div className="alertStat critical">
              <span>{criticalAlerts}</span>
              <p>Критичні</p>
            </div>

            <div className="alertStat warning">
              <span>{warningAlerts}</span>
              <p>Попередження</p>
            </div>
          </div>

          <div className="recentAlerts">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`miniAlert ${alert.severity?.toLowerCase()}`}
              >
                <strong>{alert.employeeName}</strong>

                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
