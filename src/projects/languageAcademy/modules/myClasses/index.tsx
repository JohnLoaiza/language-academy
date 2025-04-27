import { useEffect, useState } from "react";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";
import { InscriptionsResponse } from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { InscriptionModel } from "../../models/inscriptionModel";
import { ScoreModel } from "../../models/scoreModel";
import { Sesion } from "backless";
import { ScoreTable } from "./components/scoreComponent";

export const MyClasses = () => {
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);

  useEffect(() => {
    if (!inscriptions) {
      getInscriptions();
    }
  }, []);

  const getInscriptions = async () => {
    setInscriptions(
      ((await dbConnect()?.getCollection(Collections.INSCRIPTIONS))?.map(
        (c) => c
      ) as InscriptionsResponse[]).filter((i) => i.properties.userId === Sesion.props.user.username)
    );
  };

  console.log(inscriptions)

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
                key={i.group}
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
               <ScoreTable scores={i.scores}></ScoreTable>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
