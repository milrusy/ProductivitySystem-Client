import { useEffect, useState } from "react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import "./TaskDistribution.scss";
import { api } from "../../api/api";

type TaskDistribution = {
  completed: number;
  overdue: number;
  inProgress: number;
};

export const TaskDistribution = () => {
  const [data, setData] = useState<TaskDistribution | null>(null);

  useEffect(() => {
    api.get("/analytics/task-distribution").then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  const pieData = [
    { name: "Completed", value: data.completed },
    { name: "Overdue", value: data.overdue },
    { name: "In Progress", value: data.inProgress },
  ];

  const total = data.completed + data.overdue + data.inProgress;

  const completionRate = total ? (data.completed / total) * 100 : 0;

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  const insights = [
    {
      type: "danger",
      condition: data.overdue > data.completed,
      title: "Workload imbalance detected",
      message: "Overdue tasks exceed completed tasks.",
      action: "Consider redistributing tasks or increasing capacity.",
    },

    {
      type: "warning",
      condition: data.inProgress > data.completed,
      title: "High work in progress",
      message: "More tasks are in progress than completed.",
      action: "Monitor bottlenecks in workflow stages.",
    },

    {
      type: "success",
      condition: completionRate > 70,
      title: "Healthy productivity level",
      message: "Completion rate is above 70%.",
      action: "Maintain current workflow efficiency.",
    },

    {
      type: "info",
      condition: total < 10,
      title: "Low task volume",
      message: "Task volume is unusually low.",
      action: "Verify if data ingestion is complete.",
    },
  ];

  const activeInsights = insights.filter((i) => i.condition);

  return (
    <div className="taskPage">
      <h1>Task Distribution</h1>

      {/* KPI ROW */}
      <div className="kpiRow">
        <div className="kpiCard">
          <h4>Total Tasks</h4>
          <p>{total}</p>
        </div>

        <div className="kpiCard success">
          <h4>Completed</h4>
          <p>{data.completed}</p>
        </div>

        <div className="kpiCard danger">
          <h4>Overdue</h4>
          <p>{data.overdue}</p>
        </div>

        <div className="kpiCard">
          <h4>Completion Rate</h4>
          <p>{completionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* CHART */}
      <div className="card">
        <h3>Task Status Overview</h3>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={120} label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS */}
      <div className="insights">
        <h3>Insights</h3>

        {activeInsights.length === 0 && (
          <div className="alert info">
            📊 No anomalies detected — system is stable
          </div>
        )}

        {activeInsights.map((insight, index) => (
          <div key={index} className={`alert ${insight.type}`}>
            <div className="alertTitle">{insight.title}</div>

            <div className="alertMessage">{insight.message}</div>

            <div className="alertAction">👉 {insight.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
