import { useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      auth.login(res.data);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h1>Авторизація</h1>
        <p className="subtitle">Увійти у існуючий акаунт</p>

        {error && <div className="error">{error}</div>}

        <div className="form">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Авторизуватися</button>
        </div>
      </div>
    </div>
  );
};
