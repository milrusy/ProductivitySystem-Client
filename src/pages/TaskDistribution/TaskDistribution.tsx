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
      title: "Виявлено дисбаланс за статусами задач",
      message: "Кількість прострочених задач переважає кількість виконаних.",
      action: "Варто розглянути перерозподіл задач по працівникам.",
    },

    {
      type: "warning",
      condition: data.inProgress > data.completed,
      title: "Багато задач виконуються у поточний момент часу",
      message: "Кількість задач у процесі перебільшує кількість виконаних задач.",
      action: "Варто звернути увагу на блокери у задачах.",
    },

    {
      type: "success",
      condition: completionRate > 70,
      title: "Нормальний рівень продуктивності",
      message: "Частка виконаних задач більше ніж 70%.",
      action: "Поточний розподіл задач є ефективним.",
    },

    {
      type: "info",
      condition: total < 10,
      title: "Низька кількість задач",
      message: "Кількість задач нижче ніж зазвичай.",
      action: "Варто перевірити коректність оновлення даних.",
    },
  ];

  const activeInsights = insights.filter((i) => i.condition);

  return (
    <div className="taskPage">
      <h1>Статистика по задачам</h1>

      {/* KPI ROW */}
      <div className="kpiRow">
        <div className="kpiCard">
          <h4>Загальна кількість задач</h4>
          <p>{total}</p>
        </div>

        <div className="kpiCard success">
          <h4>Завершено</h4>
          <p>{data.completed}</p>
        </div>

        <div className="kpiCard danger">
          <h4>Прострочено</h4>
          <p>{data.overdue}</p>
        </div>

        <div className="kpiCard">
          <h4>Відсоток завершених задач</h4>
          <p>{completionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* CHART */}
      <div className="card">
        <h3>Розподіл задач за статусами</h3>

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
        <h3>Аналіз</h3>

        {activeInsights.length === 0 && (
          <div className="alert info">
            📊 Не виявлено аномалій - система стабільна
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
