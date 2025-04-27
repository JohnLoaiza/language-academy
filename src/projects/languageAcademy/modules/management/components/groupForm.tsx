import { useEffect, useState } from "react";
import { CategoriesResponse, UsersResponse } from "../../../models/backlessResponse";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { styles } from "../../../../../styles";
import { ScoreModel } from "../../../models/scoreModel";

interface Props {
  onBack: () => void;
  addGroup: (user: UsersResponse, name: string, schedule: ScheduleItem[], scores: ScoreModel[]) => void;
}

export interface ScheduleItem {
  day: number;
  init: string;
  end: string;
}

export const GroupForm = ({ onBack, addGroup }: Props) => {
  const [users, setUsers] = useState<UsersResponse[] | undefined>(undefined);
  const [code, setCode] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UsersResponse>();

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [newDay, setNewDay] = useState<number>(1);
  const [newInit, setNewInit] = useState<string>("");
  const [newEnd, setNewEnd] = useState<string>("");

  const [scores, setScores] = useState<ScoreModel[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newPourcentage, setNewPourcentage] = useState<number>(0);

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
    user.properties.username.toString().toLowerCase().includes(search.toLowerCase())
  );

  const addSchedule = () => {
    if (newInit && newEnd) {
      const newSchedule: ScheduleItem = { day: newDay, init: newInit, end: newEnd };
      setSchedules((prev) => [...prev, newSchedule]);
      setNewInit("");
      setNewEnd("");
    }
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const addScore = () => {
    const totalPourcentage = scores.reduce((sum, s) => sum + s.pourcentage, 0) + newPourcentage;

    if (!newTitle || !newDescription || newPourcentage <= 0) {
      alert("Completa todos los campos correctamente para agregar una nota.");
      return;
    }

    if (totalPourcentage > 100) {
      alert("La suma de los porcentajes no puede ser mayor a 100%.");
      return;
    }

    const newScore: ScoreModel = { title: newTitle, description: newDescription, pourcentage: newPourcentage, finalValue: 0 };
    setScores((prev) => [...prev, newScore]);
    setNewTitle("");
    setNewDescription("");
    setNewPourcentage(0);
  };

  const removeScore = (index: number) => {
    setScores((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = () => {
    if(scores.reduce((sum, s) => sum + s.pourcentage, 0) === 100) {
      if (!selectedUser || !code) return;
      addGroup(selectedUser, code, schedules, scores);
    } else {
      alert('La suma de los porcentajes no puede ser diferente de 100%')
    }
    
  };

  return (
    <div style={{ ...styles.mainContainer, alignItems: "flex-start", backgroundColor: "#f9fafb", borderRadius: "1rem", padding: "2rem" }}>
      <h2 style={{ ...styles.title, marginBottom: "1.5rem" }}>Nuevo grupo</h2>
   <p><strong>Profesor asignado</strong></p> 
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre de usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "0.75rem",
          marginBottom: "1.5rem",
          border: "1px solid #d1d5db",
          borderRadius: "0.5rem",
          fontSize: "1rem",
        }}
      />

      {/* Listado de usuarios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxHeight: "300px",
          overflowY: "auto",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "2rem",
        }}
      >
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                backgroundColor: selectedUser?.properties.username === user.properties.username ? "#4f46e5" : "white",
                color: selectedUser?.properties.username === user.properties.username ? "white" : "#374151",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setSelectedUser(user)}
            >
              <div style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                Usuario: {user.properties.username}
              </div>
              <p style={{ fontSize: "0.9rem" }}>Rol: {user.properties.roles.join(", ")}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#6b7280" }}>No se encontraron usuarios.</p>
        )}
      </div>

      {/* Código de grupo */}
      <div style={{ marginBottom: "2rem", width: "100%" }}>
        <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
          Código de grupo
        </label>
        <input
          type="text"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontSize: "1rem",
          }}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      {/* Horarios */}
      <h3 style={{ marginBottom: "1rem", fontWeight: "700", fontSize: "1.3rem" }}>Horarios</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Día</label>
          <select
            value={newDay}
            onChange={(e) => setNewDay(Number(e.target.value))}
            style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          >
            <option value={1}>Lunes</option>
            <option value={2}>Martes</option>
            <option value={3}>Miércoles</option>
            <option value={4}>Jueves</option>
            <option value={5}>Viernes</option>
            <option value={6}>Sábado</option>
            <option value={7}>Domingo</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Inicio</label>
          <input
            type="text"
            placeholder="8:00 am"
            value={newInit}
            onChange={(e) => setNewInit(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Fin</label>
          <input
            type="text"
            placeholder="10:00 am"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
        </div>

        <button
          onClick={addSchedule}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            marginTop: "1.5rem",
            cursor: "pointer",
          }}
        >
          Agregar horario
        </button>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: "2rem" }}>
        {schedules.map((s, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            Día {s.day} — {s.init} a {s.end}
            <button
              onClick={() => removeSchedule(index)}
              style={{
                marginLeft: "1rem",
                backgroundColor: "#ef4444",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Notas (Scores) */}
      <h3 style={{ marginBottom: "1rem", fontWeight: "700", fontSize: "1.3rem" }}>Notas</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Título de la nota"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: "1", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ flex: "2", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
        />
        <input
          type="number"
          placeholder="%"
          value={newPourcentage}
          onChange={(e) => setNewPourcentage(Number(e.target.value))}
          style={{ width: "80px", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          min={0}
          max={100}
        />
        <p><strong>%</strong></p>
        <button
          onClick={addScore}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Agregar nota
        </button>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: "2rem" }}>
        {scores.map((s, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            {s.title} — {s.description} — {s.pourcentage}%
            <button
              onClick={() => removeScore(index)}
              style={{
                marginLeft: "1rem",
                backgroundColor: "#ef4444",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Botones de acción */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={submit}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Crear grupo
        </button>

        <button
          onClick={onBack}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
