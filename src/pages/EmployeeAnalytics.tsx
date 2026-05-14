import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export const EmployeeAnalytics = () => {

  const { id } = useParams();

  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    api.get(`/users/${id}/analytics`)
      .then(res => setEmployee(res.data));
  }, [id]);

  if (!employee)
  {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "24px",
        color: "white"
      }}
    >
      <h1>{employee.name}</h1>

      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
      <p>Role: {employee.role}</p>

      <hr />

      <h2>KPI</h2>

      <div style={{
        display: "flex",
        gap: "20px"
      }}>
        <div>Completed: {employee.completedTasks}</div>

        <div>Overdue: {employee.overdueTasks}</div>

        <div>Avg Time: {employee.avgCompletionTime}</div>

        <div>Score: {employee.productivityScore}</div>
      </div>

      <hr />

      <h2>Tasks</h2>

      <table width="100%">
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

              <td>{task.status}</td>

              <td>{task.priority}</td>

              <td>{task.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
