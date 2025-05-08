import { useEffect, useState } from "react";
import { UsersResponse } from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { DbController } from "../../db/DbController";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";

const availableRoles = ["Admin", "Teacher", "Student"];

export const Users = () => {
  const [users, setUsers] = useState<UsersResponse[] | undefined>(undefined);
  const [originalUsers, setOriginalUsers] = useState<UsersResponse[] | undefined>(undefined);

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    const response = await DbController.getUsers();
    setUsers(response);
    // Guardamos una copia original para detectar cambios
    setOriginalUsers(JSON.parse(JSON.stringify(response)));
  };

  const toggleRole = (userId: string, role: string) => {
    if (!users) return;

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const roles = user.properties.roles.includes(role)
          ? user.properties.roles.filter((r) => r !== role)
          : [...user.properties.roles, role];

        return {
          ...user,
          properties: {
            ...user.properties,
            roles,
          },
        };
      }
      return user;
    });

    setUsers(updatedUsers);
  };

  const saveChanges = async (user: UsersResponse) => {
    const response = await dbConnect()?.editDocument(Collections.USERS, user.id, user);
    if (response) {
      alert("Roles actualizados");
      // Actualiza los roles en la copia original
      setOriginalUsers((prev) =>
        prev?.map((u) => (u.id === user.id ? { ...user } : u))
      );
    } else {
      alert("Error al actualizar los roles");
    }
  };

  const haveRolesChanged = (user: UsersResponse) => {
    const original = originalUsers?.find((u) => u.id === user.id);
    if (!original) return false;

    const currentRoles = [...user.properties.roles].sort();
    const originalRoles = [...original.properties.roles].sort();

    return (
      currentRoles.length !== originalRoles.length ||
      !currentRoles.every((r, i) => r === originalRoles[i])
    );
  };

  return (
    <div className="" style={{ width: "75vw" }}>
      <div style={styles.mainContainer}>
        <h2>Users</h2>
        {users?.map((user) => (
          <div
            key={user.id}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <p>
              <strong>Username:</strong> {user.properties.username}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {availableRoles.map((role) => (
                <label key={role}>
                  <input
                    type="checkbox"
                    checked={user.properties.roles.includes(role)}
                    onChange={() => toggleRole(user.id, role)}
                  />
                  {role}
                </label>
              ))}
            </div>
            {haveRolesChanged(user) && (
              <button
                onClick={() => saveChanges(user)}
                style={{ marginTop: "0.5rem" }}
              >
                Save Changes
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
