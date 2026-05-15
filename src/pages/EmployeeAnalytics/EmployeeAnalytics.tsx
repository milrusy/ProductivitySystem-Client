import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";

import "./EmployeeAnalytics.scss";

export const EmployeeAnalytics = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    api.get(`/users/${id}/analytics`).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      {/* HEADER CARD */}
      <div className="profileCard">
        <div>
          <h1>{employee.name}</h1>
          <p className="muted">{employee.email}</p>

          <div className="meta">
            <span>{employee.department}</span>
            <span>{employee.role}</span>
          </div>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="kpiGrid">
        <div className="kpiCard success">
          <h4>Completed</h4>
          <p>{employee.completedTasks}</p>
        </div>

        <div className="kpiCard danger">
          <h4>Overdue</h4>
          <p>{employee.overdueTasks}</p>
        </div>

        <div className="kpiCard">
          <h4>Avg Time</h4>
          <p>{employee.avgCompletionTime}</p>
        </div>

        <div className="kpiCard primary">
          <h4>Productivity</h4>
          <p>{employee.productivityScore}%</p>
        </div>
      </div>

      {/* TASKS */}
      <div className="card">
        <h3>Tasks Overview</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Deadline</th>
            </tr>
          </thead>

          <tbody>
            {employee.tasks.map((task: any, index: number) => (
              <tr key={index}>
                <td>{task.title}</td>

                <td>
                  <span className={`badge ${task.status}`}>{task.status}</span>
                </td>

                <td>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </td>

                <td>{task.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
