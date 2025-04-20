import { useEffect, useState } from "react";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";
import { InscriptionsResponse } from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { InscriptionModel } from "../../models/inscriptionModel";
import { ScoreModel } from "../../models/scoreModel";
import { Admin, Sesion } from "backless";

export const MyCourses = () => {
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
      ((await dbConnect()?.getCollection(Collections.INSCRIPTIONS))?.map(
        (c) => c
      ) as InscriptionsResponse[]).filter((i) => i.properties.userId === Sesion.props.user.username)
    );
  };

  return (
    <div className="" style={{ width: "75vw" }}>
      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Clases</h2>
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
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
