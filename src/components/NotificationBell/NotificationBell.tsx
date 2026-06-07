import { useEffect, useRef, useState } from "react";

import { api } from "../../api/api";

import "./NotificationBell.scss";

export const NotificationBell = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAlerts();

    const interval = setInterval(() => {
      loadAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadAlerts = async () => {
    const res = await api.get("/alerts/unread");
    setAlerts(res.data);
  };

  const markAsRead = async (id: number) => {
    await api.put(`/alerts/${id}/read`);

    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="notificationWrapper" ref={wrapperRef}>
      <button className="bellButton" onClick={() => setOpen((prev) => !prev)}>
        🔔
        {alerts.length > 0 && (
          <span className="bellBadge">{alerts.length}</span>
        )}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdownHeader">
            <h3>Сповіщення</h3>

            <span className="notificationCount">{alerts.length}</span>
          </div>

          {alerts.length === 0 && (
            <div className="emptyState">Немає непрочитаних сповіщень</div>
          )}

          {alerts.map((alert) => (
            <div key={alert.id} className={`alertItem ${alert.severity}`}>
              <div className="alertTop">
                <div className="severityBlock">
                  <span className="severityIcon">
                    {alert.severity === "Critical" && "🔴"}
                    {alert.severity === "Warning" && "🟡"}
                    {alert.severity === "Info" && "🔵"}
                  </span>

                  <span className="severityText">{alert.employeeName}</span>
                </div>
              </div>

              <div className="alertContent">
                <p>{alert.message}</p>

                <small>{new Date(alert.createdAt).toLocaleString()}</small>
              </div>
              <button
                className="readButton"
                onClick={() => markAsRead(alert.id)}
              >
                Прочитати
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
