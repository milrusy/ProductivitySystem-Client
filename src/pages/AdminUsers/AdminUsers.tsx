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
      setLoading(true);

      const res = await api.post("/users", {
        name,
        email,
        departmentId: Number(departmentId),
        role
      });

      setGeneratedPassword(
        res.data.temporaryPassword
      );

      setName("");
      setEmail("");
      setDepartmentId("");
      setRole("Employee");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminPage">

      <div className="adminCard">

        <div className="adminHeader">
          <div>
            <h1>User Administration</h1>

            <p>
              Create employee accounts,
              assign departments and generate
              temporary credentials.
            </p>
          </div>
        </div>

        <div className="formGrid">

          <div className="inputGroup">
            <label>Full Name</label>

            <input
              placeholder="John Doe"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="inputGroup">
            <label>Email</label>

            <input
              placeholder="john@company.com"
              value={email}
              onChange={e =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="inputGroup">
            <label>Department</label>

            <select
              value={departmentId}
              onChange={e =>
                setDepartmentId(e.target.value)
              }
            >
              <option value="">
                Select Department
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
            <label>Role</label>

            <select
              value={role}
              onChange={e =>
                setRole(e.target.value)
              }
            >
              <option value="Employee">
                Employee
              </option>

              <option value="Admin">
                Admin
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
            ? "Creating..."
            : "Create User"}
        </button>

        {generatedPassword && (
          <div className="passwordCard">

            <div className="passwordTitle">
              Temporary Password
            </div>

            <div className="passwordValue">
              {generatedPassword}
            </div>

            <p>
              Share this password securely
              with the employee. They should
              change it after first login.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};
