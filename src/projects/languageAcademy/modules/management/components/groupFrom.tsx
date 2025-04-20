import { useEffect, useState } from "react";
import {
  CategoriesResponse,
  UsersResponse,
} from "../../../models/backlessResponse";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { styles } from "../../../../../styles";

interface Props {
  onBack: () => void;
  addGroup: (user: UsersResponse, name: string) => void;
}

export const GroupForm = ({ onBack, addGroup }: Props) => {
  const [users, setUsers] = useState<UsersResponse[] | undefined>(undefined);
  const [code, setCode] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UsersResponse>();

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    const result = await dbConnect()?.getCollection(Collections.USERS);
    const userList = (result?.map((c) => c) as UsersResponse[]).filter((u) =>
      u.properties.roles.includes("Teacher")
    );
    setUsers(userList);
  };

  const filteredUsers = users?.filter((user) =>
    user.properties.username
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const submit = () => {
    addGroup(selectedUser!, code!);
  };

  return (
    <div style={{ ...styles.mainContainer, alignItems: "flex-start" }}>
      <h2 style={styles.title}>Nuevo grupo</h2>

      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre de usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
        }}
      />

      {/* Listado de usuarios */}
      <div
        style={{
          ...styles.grid,
          maxHeight: "300px",
          width: "100%",
          maxWidth: "600px",
          paddingRight: "0.5rem",
        }}
      >
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{...styles.card, backgroundColor: selectedUser?.properties.username === user.properties.username ? '#515ca3' : 'white'}}
              onClick={() => setSelectedUser(user)}
             
            >
              <div style={styles.cardTitle}>
                Usuario: {user.properties.username}
              </div>
              <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                Rol: {user.properties.roles.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#6b7280" }}>No se encontraron usuarios.</p>
        )}
      </div>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Codigo de grupo
      </label>
      <input
        type="text"
        style={{
          width: "50%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "0.375rem",
        }}
        onChange={(e) => setCode(e.target.value)}
      />
      {/* Botón de cancelar */}
      <button
        style={{
          ...styles.button,
          marginTop: "1rem",
          backgroundColor: "#DC2626",
        }}
        onClick={() => submit()}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#B91C1C")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#DC2626")
        }
      >
        Crear grupo
      </button>
      <button
        style={{
          ...styles.button,
          marginTop: "1rem",
          backgroundColor: "#DC2626",
        }}
        onClick={onBack}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#B91C1C")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#DC2626")
        }
      >
        Cancelar
      </button>
    </div>
  );
};
