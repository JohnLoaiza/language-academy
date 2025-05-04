import React, { useState } from "react";
import { Attendance, AttendanceRecord } from "../../../models/courseCategory";

interface AttendanceFormProps {
  students: string[];
  onSave: (entry: Attendance) => void;
  onBack: () => void;
  pastAttendance?: Attendance[]; // historial
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  students,
  onSave,
  onBack,
  pastAttendance = [],
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s) => [s, true]))
  );
  const [selectedHistory, setSelectedHistory] = useState<Attendance | null>(null);

  const handleCheckboxChange = (student: string) => {
    setAttendance((prev) => ({ ...prev, [student]: !prev[student] }));
  };

  const handleSubmit = () => {
    const records: AttendanceRecord[] = students.map((student) => ({
      student,
      present: attendance[student],
    }));
    onSave({ date, records });
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Columna para tomar asistencia */}
      <div style={{ flex: 1, border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Toma de asistencia</h3>

        <label style={{ display: "block", marginBottom: "1rem" }}>
          Fecha:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: "4px", marginLeft: "8px" }}
          />
        </label>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {students.map((student) => (
            <li key={student} style={{ marginBottom: "8px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={attendance[student]}
                  onChange={() => handleCheckboxChange(student)}
                />
                {"  "}
                {student}
              </label>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 16px",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Guardar asistencia
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Volver
          </button>
        </div>
      </div>

      {/* Columna de historial de asistencia */}
      <div style={{ flex: 1 }}>
        <h3>Historial de asistencia</h3>
        {pastAttendance.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No hay registros previos.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {pastAttendance.map((entry, i) => (
              <li
                key={i}
                onClick={() => setSelectedHistory(entry)}
                style={{
                  cursor: "pointer",
                  marginBottom: "8px",
                  padding: "6px",
                  borderRadius: "4px",
                  backgroundColor: "#f3f4f6",
                }}
              >
                {entry.date}
              </li>
            ))}
          </ul>
        )}

        {selectedHistory && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Asistencia del {selectedHistory.date}</h4>
            <ul style={{ padding: 0, listStyle: "none" }}>
              {selectedHistory.records.map((r) => (
                <li key={r.student}>
                  {r.student}:{" "}
                  <span style={{ color: r.present ? "green" : "red" }}>
                    {r.present ? "Presente" : "Ausente"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
