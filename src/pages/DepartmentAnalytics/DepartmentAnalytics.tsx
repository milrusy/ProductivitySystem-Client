import { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./DepartmentAnalytics.scss";

type DepartmentAnalyticsDto = {
  departmentName: string;
  employeesCount: number;
  completedTasks: number;
  overdueTasks: number;
  averageProductivity: number;
};

export const DepartmentAnalytics = () => {
  const [data, setData] = useState<DepartmentAnalyticsDto[]>([]);

  useEffect(() => {
    api.get("/metrics/departments").then((res) => setData(res.data));
  }, []);

  const totalEmployees = data.reduce((s, d) => s + d.employeesCount, 0);
  const totalCompleted = data.reduce((s, d) => s + d.completedTasks, 0);
  const totalOverdue = data.reduce((s, d) => s + d.overdueTasks, 0);

  const avgProductivity = data.length
    ? data.reduce((s, d) => s + d.averageProductivity, 0) / data.length
    : 0;

  return (
    <div className="depPage">
      {/* HEADER */}
      <div className="header">
        <h1>Статистика за відділами</h1>
        <p>Загальна статистика щодо продуктивності за відділами</p>
      </div>

      {/* KPI */}
      <div className="kpiGrid">
        <div className="kpiCard">
          <div className="label">Кількість працівників</div>
          <div className="value">{totalEmployees}</div>
        </div>

        <div className="kpiCard">
          <div className="label">Завершені задачі</div>
          <div className="value">{totalCompleted}</div>
        </div>

        <div className="kpiCard danger">
          <div className="label">Прострочені задачі</div>
          <div className="value">{totalOverdue}</div>
        </div>

        <div className="kpiCard">
          <div className="label">Середня оцінка продуктивності</div>
          <div className="value">{avgProductivity.toFixed(1)}</div>
        </div>
      </div>

      {/* CHART */}
      <div className="card">
        <h3>Продуктивність за відділами</h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="departmentName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="averageProductivity" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>Дані за відділом</h3>

        <table>
          <thead>
            <tr>
              <th>Відділ</th>
              <th>Працівники</th>
              <th>Завершено</th>
              <th>Прострочено</th>
              <th>Продуктивність</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.departmentName}>
                <td>{d.departmentName}</td>
                <td>{d.employeesCount}</td>
                <td>{d.completedTasks}</td>
                <td className="dangerCell">{d.overdueTasks}</td>
                <td>{d.averageProductivity.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
