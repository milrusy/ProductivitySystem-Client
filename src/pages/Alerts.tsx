import { useEffect, useState } from "react";
import { api } from "../api/api";

export const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        color: "white",
      }}
    >
      <h1>Alerts</h1>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            border: "1px solid gray",
            padding: "16px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <h3>{alert.message}</h3>

          <p>Employee: {alert.employeeName}</p>

          <p>Severity: {alert.severity}</p>

          <p>{new Date(alert.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
