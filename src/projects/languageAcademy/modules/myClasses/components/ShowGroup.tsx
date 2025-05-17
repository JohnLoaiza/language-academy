import { ShowLeveling } from "..";
import { styles } from "../../../../../styles";
import { btnStyle } from "../../../../../styles/buttonStyle";
import { InscriptionsResponse } from "../../../models/backlessResponse";
import {
  Activity,
  Group,
  RemedialRequest,
} from "../../../models/courseCategory";
import ShowSchedule from "../../management/components/showSchedule";
import { ActivityList } from "./activityList";

interface GroupInteractionPanelProps {
  group: Group;
  inscription: InscriptionsResponse;
  remedials: RemedialRequest[];
  onBack: () => void;
  selectActivity: (
    activity: Activity,
    inscription: InscriptionsResponse,
    group: Group,
    remedials: RemedialRequest[]
  ) => void;
  handleNivelacion: (category: string, course: string, group: string) => void;
  setShowLeveling: (data: ShowLeveling | undefined) => void;
}

const ShowGroup: React.FC<GroupInteractionPanelProps> = ({
  group,
  inscription,
  remedials,
  selectActivity,
  handleNivelacion,
  setShowLeveling,
  onBack,
}) => {
  return (
    <>
      <button
        style={{
          ...styles.button,
          backgroundColor: "#6B7280",
          maxWidth: "100px",
        }}
        onClick={onBack}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#4B5563")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#6B7280")
        }
      >
        ←
      </button>
      <ShowSchedule group={group} />
      <ActivityList
        remedials={remedials}
        group={group}
        inscription={inscription}
        activities={group.activities}
        onSelectActivity={selectActivity}
      />
      {remedials ? (
        <button
          style={btnStyle("#10b981")}
          onClick={() =>
            setShowLeveling({
              group: group,
              remedials: remedials,
            })
          }
        >
          Ver estado de nivelaciones
        </button>
      ) : (
        <button
          style={btnStyle("#3b82f6")}
          onClick={() =>
            handleNivelacion(
              inscription.properties.category,
              inscription.properties.course,
              inscription.properties.group
            )
          }
        >
          Solicitar Nivelación
        </button>
      )}
    </>
  );
};

export default ShowGroup;
