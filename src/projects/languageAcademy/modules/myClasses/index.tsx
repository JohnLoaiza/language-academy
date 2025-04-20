import { useEffect, useState } from "react";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";
import { InscriptionsResponse } from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { InscriptionModel } from "../../models/inscriptionModel";
import { ScoreModel } from "../../models/scoreModel";

export const MyClasses = () => {
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);

  useEffect(() => {
    if (!inscriptions) {
      getCategories();
    }
  }, []);

  const getCategories = async () => {
    setInscriptions(
      (await dbConnect()?.getCollection(Collections.INSCRIPTIONS))?.map(
        (c) => c
      ) as InscriptionsResponse[]
    );
  };

  return (
    <div className="" style={{ width: "75vw" }}>
      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Mis clases</h2>
        </div>
        <div>
          {inscriptions
            ?.map((i: InscriptionsResponse) => i.properties)
            .map((i: InscriptionModel) => (
              <div
                key={i.course}
                style={{
                  ...styles.card,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "1rem",
                  gap: "2rem",
                }}
                onClick={() => {}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#eff6ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                {/* Columna izquierda: datos del curso */}
                <div style={{ flex: 1 }}>
                  <p>
                    <strong>Curso:</strong> {i.course}
                  </p>
                  <p>
                    <strong>Grupo:</strong> {i.group}
                  </p>
                  <p>
                    <strong>Categoria:</strong> {i.category}
                  </p>
                </div>

                {/* Columna derecha: tabla de calificaciones */}
                <div style={{ flex: 1 }}>
                  <p>
                    <strong>Calificaciones:</strong>
                  </p>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.9rem",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f3f4f6" }}>
                        <th style={styles.thStyle}>Título</th>
                        <th style={styles.thStyle}>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {i.scores.map((score: ScoreModel, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #e5e7eb" }}
                        >
                          <td style={styles.tdStyle}>{score.title}</td>
                          <td style={styles.tdStyle}>
                            {score.finalValue ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
