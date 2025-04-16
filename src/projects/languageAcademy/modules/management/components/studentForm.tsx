import { useEffect, useState } from "react";
import { CategoriesResponse, UsersResponse } from "../../../models/backlessResponse";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { styles } from "../../../../../styles";
import { Group } from "../../../models/courseCategory";

interface Props {
  group: Group;
  onBack: () => void;
  addStudent: (user: UsersResponse) => void;
  category: CategoriesResponse;
}

export const StudentForm = ({ onBack, addStudent }: Props) => {
  const [users, setUsers] = useState<UsersResponse[] | undefined>(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    const result = await dbConnect()?.getCollection(Collections.USERS);
    const userList = result?.map(c => c) as UsersResponse[];
    setUsers(userList);
  };

  const filteredUsers = users?.filter(user =>
    user.properties.username.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ ...styles.mainContainer, alignItems: 'flex-start' }}>
      <h2 style={styles.title}>Nuevo estudiante</h2>

      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre de usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
        }}
      />

      {/* Listado de usuarios */}
      <div
        style={{
          ...styles.grid,
          maxHeight: '300px',
          width: '100%',
          maxWidth: '600px',
          paddingRight: '0.5rem',
        }}
      >
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              style={styles.card}
              onClick={() => addStudent(user)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <div style={styles.cardTitle}>Usuario: {user.properties.username}</div>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Roles: {user.properties.roles.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: '#6b7280' }}>No se encontraron usuarios.</p>
        )}
      </div>

      {/* Botón de cancelar */}
      <button
        style={{ ...styles.button, marginTop: "1rem", backgroundColor: "#DC2626" }}
        onClick={onBack}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B91C1C")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DC2626")}
      >
        Cancelar
      </button>
    </div>
  );
};
