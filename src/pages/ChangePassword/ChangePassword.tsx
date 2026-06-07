import { useState } from "react";
import { api } from "../../api/api";
import "./ChangePassword.scss";

export const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirm) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e: any) {
      setError(e?.response?.data || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="changePasswordPage">
      <div className="card">
        <h1>Змінити пароль</h1>
        <p className="subtitle">Оновити пароль від вашого акаунту</p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="form">
          <input
            type="password"
            placeholder="Поточний пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Новий пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Підтвердити новий пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            onClick={changePassword}
            disabled={loading}
          >
            {loading ? "Оновлення..." : "Змінити пароль"}
          </button>
        </div>
      </div>
    </div>
  );
};
