import { useState } from "react";
import { styles } from "../../../../../styles";
import { DynamicForm } from "../../../../../components/form";
import { Course, Group } from "../../../models/courseCategory";
import { CategoriesResponse } from "../../../models/backlessResponse";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { AdminGroup } from "./adminGroup";

interface Props {
  course: Course;
  onBack: () => void;
  category: CategoriesResponse;
}

export const GroupsList = ({ category, course, onBack }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const addGroup = async (data: any) => {
    const newGroup: Group = {
      name: data["Nombre"],
      teacher: data["Profesor"],
      schedule: [],
      students: [],
      scores: [],
    };
    category.properties.courses
      .find((c) => c.name === course.name)
      ?.groups.push(newGroup);
    var response = await dbConnect()?.editDocument(
      Collections.CATEGORIES,
      category.id,
      category
    );
    if (response) {
      alert("Grupo creado correctamente");
      setShowForm(false);
    } else {
      alert("No se pudo insertar grupo");
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
        <DynamicForm
          fields={["Nombre", "Profesor"]}
          onSubmit={(data: any) => addGroup(data)}
          onClose={() => setShowForm(false)}
        ></DynamicForm>
      )}
    </>
  );
};
