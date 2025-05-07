import { useState } from "react";
import { styles } from "../../../../../styles";
import { Course, Group } from "../../../models/courseCategory";
import {
  CategoriesResponse,
  UsersResponse,
} from "../../../models/backlessResponse";
import { AdminGroup } from "./adminGroup";
import { GroupForm, ScheduleItem } from "./groupForm";
import { ScoreModel } from "../../../models/scoreModel";
import { GroupCreationContext } from "../../../../../utils/patterns/chainOfresponsability/contexts/GroupCreationContext";
import { AddGroupHandler } from "../../../../../utils/patterns/chainOfresponsability/handlers/addGroupHandler";
import { SaveCategoryHandler } from "../../../../../utils/patterns/chainOfresponsability/handlers/SaveCategoryHandler";
import { CreateInscriptionHandler } from "../../../../../utils/patterns/chainOfresponsability/handlers/CreateInscriptionHandler";
import { NotificationHandler } from "../../../../../utils/patterns/chainOfresponsability/handlers/NotificationHandler";

interface Props {
  course: Course;
  onBack: () => void;
  category: CategoriesResponse;
}

export const GroupsList = ({ category, course, onBack }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  
  const addGroup = async (
    user: UsersResponse,
    name: string,
    schedules: ScheduleItem[],
    scores: ScoreModel[],
    onSuccess: () => void
  ) => {
    const context: GroupCreationContext = {
      user,
      name,
      schedules,
      scores,
      category,
      course,
    };
  
    const handlerChain = new AddGroupHandler()
      .setNext(new SaveCategoryHandler())
      .setNext(new CreateInscriptionHandler())
      .setNext(new NotificationHandler(onSuccess));
  
    const result = await handlerChain.handle(context);
    if (!result) {
      alert("No se pudo crear el grupo");
    }
  };
  

  return (
    <>
      {!showForm ? (
        currentGroup ? (
          <AdminGroup
            course={course}
            group={currentGroup}
            onBack={() => setCurrentGroup(null)}
            category={category}
          ></AdminGroup>
        ) : (
          <div style={styles.mainContainer}>
            <div style={styles.header}>
              <h2 style={styles.title}>Grupos en {course.name}</h2>
            </div>

            <button
              style={{
                ...styles.button,
                backgroundColor: "#6B7280",
                maxWidth: "100px",
              }}
              onClick={onBack}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4B5563")
              } // gris más oscuro
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B7280")
              }
            >
              ←
            </button>

            <div style={styles.grid}>
              {course.groups.map((group: Group) => (
                <div
                  key={group.name}
                  style={styles.card}
                  onClick={() => setCurrentGroup(group)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#eff6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <div style={styles.cardTitle}>{group.name}</div>
                </div>
              ))}
            </div>

            <button
              style={styles.button}
              onClick={() => setShowForm(true)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.buttonHover.backgroundColor!)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.button.backgroundColor!)
              }
            >
              + Nuevo Grupo
            </button>
          </div>
        )
      ) : (
        <GroupForm
          addGroup={(user: UsersResponse, name: string, schedules: ScheduleItem[], scores: ScoreModel[]) => addGroup(user, name, schedules, scores, () => {})}
          onBack={() => setShowForm(false)}
        ></GroupForm>
      )}
    </>
  );
};
