import { RemedialRequest, Group } from "../../../models/courseCategory";
import { CategoriesResponse } from "../../../models/backlessResponse";
import { styles } from "../../../../../styles";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";

interface Props {
  remedials: RemedialRequest[];
  group: Group;
  category: CategoriesResponse;
  onBack: () => void;
  howTeacher?: boolean;
}

export const RemedialList = ({
  remedials,
  howTeacher,
  category,
  onBack,
}: Props) => {
  const handleStatusChange = async (
    id: string,
    status: RemedialRequest["status"],
    instructions?: string
  ) => {
    const remedial = remedials.find((r) => r.id === id);
    if (!remedial) return;

    remedial.status = status;
    if (instructions) remedial.instructions = instructions;
    if (status === "resuelta") remedial.resolvedAt = new Date().toISOString();

    // Guardar en base de datos
    const response = await dbConnect()?.editDocument(
      Collections.CATEGORIES,
      category.id,
      category
    );

    if (response) {
      alert("Nivelación aceptada");
    } else {
      alert("No se pudo aceptar la nivelación");
    }
  };

  return (
    <div style={styles.mainContainer}>
      <h2 style={styles.title}>Nivelaciones del grupo</h2>
      <button
        style={{ ...styles.button, maxWidth: "100px" }}
        onClick={onBack}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#4B5563")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#6B7280")
        }
      >
        ← Volver
      </button>

      {remedials.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No hay solicitudes de nivelación.</p>
      ) : (
        <ul style={{ marginTop: "1rem" }}>
          {remedials.map((r) => (
            <li key={r.id} style={{ ...styles.card, marginBottom: "1rem" }}>
              <p>
                <strong>Estudiante:</strong> {r.student}
              </p>
              <p>
                <strong>Fecha de solicitud:</strong>{" "}
                {new Date(r.requestedAt).toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong> {r.status}
              </p>
              {r.instructions && (
                <p>
                  <strong>Instrucciones:</strong> {r.instructions}
                </p>
              )}
              {r.studentResponse && (
                <p>
                  <strong>Respuesta del estudiante:</strong> {r.studentResponse}
                </p>
              )}

              {r.status === "pendiente" &&
                (!howTeacher ? (
                  <button
                    style={{ ...styles.button, backgroundColor: "#b1b1b1" }}
                    onClick={() => {}}
                  >
                    Pendiente
                  </button>
                ) : (
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      style={{ ...styles.button, backgroundColor: "#10b981" }}
                      onClick={() => {
                        const inst = prompt("¿Qué debe hacer el estudiante?");
                        if (inst) handleStatusChange(r.id, "aceptada", inst);
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      style={{
                        ...styles.button,
                        backgroundColor: "#ef4444",
                        marginLeft: "0.5rem",
                      }}
                      onClick={() => handleStatusChange(r.id, "rechazada")}
                    >
                      Rechazar
                    </button>
                  </div>
                ))}

              {r.status === "aceptada" && !r.resolvedAt && (
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: "#3b82f6",
                    marginTop: "0.5rem",
                  }}
                  onClick={() => handleStatusChange(r.id, "resuelta")}
                >
                  Aceptada
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
