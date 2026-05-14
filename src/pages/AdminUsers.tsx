import { useEffect, useState } from "react";
import { api } from "../api/api";

export const AdminUsers = () => {

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <h1>Users</h1>

      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
