import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";

import "./AlertsAnalytics.scss";

type AlertSeverity = "Critical" | "Warning" | "Info";

type Alert = {
  id: number;
  employeeName: string;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  isRead: boolean;
};

export const AlertsAnalytics = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [filter, setFilter] = useState<"All" | AlertSeverity>("All");

  const [readFilter, setReadFilter] = useState<"All" | "Unread" | "Read">(
    "All",
  );

  useEffect(() => {
    api.get("/alerts").then((res) => setAlerts(res.data));
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const severityMatch = filter === "All" || a.severity === filter;

      const readMatch =
        readFilter === "All" ||
        (readFilter === "Unread" && !a.isRead) ||
        (readFilter === "Read" && a.isRead);

      return severityMatch && readMatch;
    });
  }, [alerts, filter, readFilter]);

  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredAlerts]);

  const criticalCount = alerts.filter((a) => a.severity === "Critical").length;

  const warningCount = alerts.filter((a) => a.severity === "Warning").length;

  const infoCount = alerts.filter((a) => a.severity === "Info").length;

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markAsRead = async (id: number) => {
    await api.put(`/alerts/${id}/read`);

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert,
      ),
    );
  };

  return (
    <div className="alertsPage">
      {/* HERO */}
      <div className="heroCard">
        <div>
          <h1>Alerts & Risk Monitoring</h1>

          <p>
            Monitor productivity anomalies, employee risks and operational
            issues across the organization.
          </p>
        </div>

        <div className="heroBadge">{unreadCount} unread</div>
      </div>

      {/* KPI */}
      <div className="kpiGrid">
        <div className="kpiCard critical">
          <div className="kpiLabel">Critical Alerts</div>

          <div className="kpiValue">{criticalCount}</div>
        </div>

        <div className="kpiCard warning">
          <div className="kpiLabel">Warnings</div>

          <div className="kpiValue">{warningCount}</div>
        </div>

        <div className="kpiCard info">
          <div className="kpiLabel">Informational</div>

          <div className="kpiValue">{infoCount}</div>
        </div>

        <div className="kpiCard unread">
          <div className="kpiLabel">Unread</div>

          <div className="kpiValue">{unreadCount}</div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filterRow">
        <button
          className={filter === "All" ? "filterBtn active" : "filterBtn"}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={filter === "Critical" ? "filterBtn active" : "filterBtn"}
          onClick={() => setFilter("Critical")}
        >
          Critical
        </button>
        <button
          className={filter === "Warning" ? "filterBtn active" : "filterBtn"}
          onClick={() => setFilter("Warning")}
        >
          Warning
        </button>
        <button
          className={filter === "Info" ? "filterBtn active" : "filterBtn"}
          onClick={() => setFilter("Info")}
        >
          Info
        </button>
      </div>
      <div className="filterRow">
        <button
          className={readFilter === "All" ? "filterBtn active" : "filterBtn"}
          onClick={() => setReadFilter("All")}
        >
          All
        </button>

        <button
          className={readFilter === "Unread" ? "filterBtn active" : "filterBtn"}
          onClick={() => setReadFilter("Unread")}
        >
          Unread
        </button>

        <button
          className={readFilter === "Read" ? "filterBtn active" : "filterBtn"}
          onClick={() => setReadFilter("Read")}
        >
          Read
        </button>
      </div>

      {/* ALERTS */}
      <div className="alertsGrid">
        {sortedAlerts.length === 0 && (
          <div className="emptyState">
            <h3>No alerts found</h3>

            <p>There are currently no alerts matching this filter.</p>
          </div>
        )}

        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
                alertCard
                ${alert.severity.toLowerCase()}
                ${alert.isRead ? "read" : ""}
            `}
          >
            <div className="alertHeader">
              <div className="headerLeft">
                <h3>{alert.employeeName}</h3>

                <div className="badges">
                  <span className={`severity ${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>

                  {!alert.isRead && <span className="unreadBadge">Unread</span>}
                </div>
              </div>

              {!alert.isRead && (
                <button
                  className="readBtn"
                  onClick={() => markAsRead(alert.id)}
                >
                  Mark as read
                </button>
              )}
            </div>

            <div className="alertBody">{alert.message}</div>

            <div className="alertFooter">
              {new Date(alert.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
