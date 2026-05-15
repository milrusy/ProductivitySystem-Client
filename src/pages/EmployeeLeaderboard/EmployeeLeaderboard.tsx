import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

import "./EmployeeLeaderboard.scss";

type Employee = {
  userId: number;
  name: string;
  department: string;
  completedTasks: number;
  overdueTasks: number;
  productivityScore: number;
};

export const EmployeeLeaderboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<keyof Employee>("productivityScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    api.get("/metrics/employees").then((res) => setEmployees(res.data));
  }, []);

  const topTen = employees.slice(0, 10);

  const sorted = [...employees].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    return sortDir === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }

    requestAnimationFrame(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const SortIcon = ({
    active,
    dir,
  }: {
    active: boolean;
    dir: "asc" | "desc";
  }) => {
    if (!active) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return <span>{dir === "asc" ? "▲" : "▼"}</span>;
  };

  return (
    <div className="empPage">
      <h1>Employee Leaderboard</h1>

      {/* OPTIONAL: mini chart */}
      <div className="card">
        <h3>Productivity Overview</h3>

        <div className="gridChart">
          {topTen.map((e, index) => (
            <div
              key={e.userId}
              className="barRow"
              onClick={() => navigate(`/employees/${e.userId}`)}
            >
              <span className="rank">#{index + 1}</span>

              <span className="name">{e.name}</span>

              <div className="barWrapper">
                <div
                  className="barFill"
                  style={{
                    width: `${e.productivityScore >= 0 ? e.productivityScore : 0}%`,
                  }}
                />
              </div>

              <span className="score">{e.productivityScore}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* FULL TABLE */}
      <div className="card">
        <h3>Full Ranking</h3>

        <table ref={tableRef}>
          <thead>
            <tr>
              <th>Rank</th>

              <th onClick={() => handleSort("name")} className="sortable">
                Name <SortIcon active={sortBy === "name"} dir={sortDir} />
              </th>

              <th onClick={() => handleSort("department")} className="sortable">
                Department{" "}
                <SortIcon active={sortBy === "department"} dir={sortDir} />
              </th>

              <th
                onClick={() => handleSort("completedTasks")}
                className="sortable"
              >
                Completed{" "}
                <SortIcon active={sortBy === "completedTasks"} dir={sortDir} />
              </th>

              <th
                onClick={() => handleSort("overdueTasks")}
                className="sortable"
              >
                Overdue{" "}
                <SortIcon active={sortBy === "overdueTasks"} dir={sortDir} />
              </th>

              <th
                onClick={() => handleSort("productivityScore")}
                className="sortable"
              >
                Score{" "}
                <SortIcon
                  active={sortBy === "productivityScore"}
                  dir={sortDir}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((e, index) => (
              <tr
                key={e.userId}
                onClick={() => navigate(`/employees/${e.userId}`)}
                className="rowClickable"
              >
                <td>#{index + 1}</td>
                <td>{e.name}</td>
                <td>{e.department}</td>
                <td>{e.completedTasks}</td>
                <td className={e.overdueTasks !== 0 ? "danger" : ""}>
                  {e.overdueTasks}
                </td>
                <td>{e.productivityScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
