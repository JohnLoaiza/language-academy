import { btnStyle } from "../../../../../styles/buttonStyle";
import { InscriptionsResponse } from "../../../models/backlessResponse";
import { Activity, Group, RemedialRequest } from "../../../models/courseCategory";
import { findMyActivity } from "./activitySubmission";

type Props = {
  activities: Activity[];
  inscription: InscriptionsResponse;
  group: Group,
  remedials: RemedialRequest[],
  onSelectActivity: (
    activity: Activity,
    inscription: InscriptionsResponse,
    group: Group,
    remedials: RemedialRequest[]
  ) => void;
};

export const ActivityList = ({
  activities,
  onSelectActivity,
  inscription,
  group,
  remedials
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
                onClick={() => onSelectActivity(act, inscription, group, remedials)}
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


