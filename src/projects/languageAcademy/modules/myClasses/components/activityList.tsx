import { InscriptionsResponse } from "../../../models/backlessResponse";
import { Activity } from "../../../models/courseCategory";
import { findMyActivity } from "./activitySubmission";

type Props = {
  activities: Activity[];
  inscription: InscriptionsResponse;
  onSelectActivity: (
    activity: Activity,
    inscription: InscriptionsResponse
  ) => void;
};

export const ActivityList = ({
  activities,
  onSelectActivity,
  inscription,
}: Props) => {
  return (
    <>
      {activities ? (
        activities.map((act) => {
          const finish: Activity | undefined = findMyActivity(
            inscription,
            act.id
          );

          return (
            <li key={act.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{act.title}</strong> ({act.type}) -{" "}
              {new Date(act.date).toLocaleDateString()}
              {/*act.fileUrl && (
                     <a
                       href={act.fileUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       style={{ marginLeft: "1rem", color: "#3b82f6" }}
                     >
                       Ver archivo
                     </a>
                   )*/}
              <button
                style={{
                  marginLeft: "1rem",
                  ...btnStyle(finish ? "#2667cb" : "#f97316", "0.3rem 0.6rem"),
                }}
                onClick={() => onSelectActivity(act, inscription)}
              >
              {finish ? "Entregada" : "Entregar actividad"}
              </button>
            </li>
          );
        })
      ) : (
        <>No hay actividades para mostrar</>
      )}
    </>
  );
};

// Botón reutilizable
export const btnStyle = (bg: string, padding: string = "0.5rem 1rem") => ({
  padding,
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
});
