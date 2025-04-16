import { useState } from "react";
import { styles } from "../../../../../styles";
import { Course } from "../../../models/courseCategory";
import { DynamicForm } from "../../../../../components/form";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { CategoriesResponse } from "../../../models/backlessResponse";

interface Props {
  category: CategoriesResponse;
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
}

export const CoursesList = ({ category, onBack, onSelectCourse }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const addCourse = async (data: any) => {
    const newCourse: Course = {
      name: data["Nombre"],
      description: data["Descripcion"],
      initDate: data["Fecha inicial"],
      endDate: data["Fecha final"],
      groups: [],
    };
    category.properties.courses.push(newCourse);
    var response = await dbConnect()?.editDocument(
      Collections.CATEGORIES,
      category.id,
      category
    );
    if (response) {
      alert("Curso creado correctamente");
      setShowForm(false);
    } else {
      alert("No se pudo insertar curso");
    }
  };

  return (
    <>
      {!showForm ? (
        <div style={styles.mainContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Cursos de {category.properties.name}</h2>
          </div>

          <button
            style={{ ...styles.button, backgroundColor: "#6B7280", maxWidth: '100px'  }}
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

          <div style={styles.grid}>
            {category.properties.courses.map((course) => (
              <div
                key={course.name}
                style={styles.card}
                onClick={() => onSelectCourse(course)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#eff6ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <div style={styles.cardTitle}>{course.name}</div>
              </div>
            ))}
          </div>
          <button
            style={styles.button}
            onClick={() => setShowForm(true)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
          >
            + Nuevo Curso
          </button>
        </div>
      ) : (
        <DynamicForm
          fields={["Nombre", "Descripcion", "Fecha inicial", "Fecha final"]}
          onSubmit={(data: any) => addCourse(data)}
          onClose={() => setShowForm(false)}
        ></DynamicForm>
      )}
    </>
  );
};
