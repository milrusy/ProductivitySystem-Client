import { useEffect, useState } from "react";
import { api } from "../../api/api";

import "./AdminUsers.scss";

export const AdminUsers = () => {
  const [departments, setDepartments] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [departmentId, setDepartmentId] =
    useState("");

  const [role, setRole] =
    useState("Employee");

  const [generatedPassword, setGeneratedPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    api.get("/departments")
      .then(res => setDepartments(res.data));
  }, []);

  const createUser = async () => {
    try {
      const res = await api.post("/users", {
        name,
        email,
        departmentId: Number(departmentId),
        role
      });

      setGeneratedPassword(res.data.temporaryPassword);

      setName("");
      setEmail("");
    } catch (err: any) {
      alert(err?.response?.data || "Error creating user");
    }
  };

  return (
    <div className="adminPage">

      <div className="adminCard">

        <div className="adminHeader">
          <div>
            <h1>Керування користувачами</h1>

            <p>
              Створіть акаунт працівника і отримайте тимчасовий пароль
            </p>
          </div>
        </div>

        <div className="formGrid">

          <div className="inputGroup">
            <label>Повне ім'я</label>

            <input
              placeholder="John Doe"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="inputGroup">
            <label>Електронна пошта</label>

            <input
              placeholder="john@company.com"
              value={email}
              onChange={e =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="inputGroup">
            <label>Відділ</label>

            <select
              value={departmentId}
              onChange={e =>
                setDepartmentId(e.target.value)
              }
            >
              <option value="">
                Обрати відділ
              </option>

              {departments.map(dep => (
                <option
                  key={dep.id}
                  value={dep.id}
                >
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inputGroup">
            <label>Роль</label>

            <select
              value={role}
              onChange={e =>
                setRole(e.target.value)
              }
            >
              <option value="Employee">
                Працівник
              </option>

              <option value="Admin">
                Адміністратор
              </option>
            </select>
          </div>

        </div>

        <button
          className="createBtn"
          onClick={createUser}
          disabled={loading}
        >
          {loading
            ? "Створення..."
            : "Створити користувача"}
        </button>

        {generatedPassword && (
          <div className="passwordCard">

            <div className="passwordTitle">
              Тимчасовий пароль
            </div>

            <div className="passwordValue">
              {generatedPassword}
            </div>

            <p>
              Безпечно передайте цей пароль працівнику. Пароль необхідно змінити після першої авторизації в системі.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};
