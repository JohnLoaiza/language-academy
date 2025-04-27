import { useEffect, useState } from "react";
import { styles } from "../../../../../styles";
import {
  CategoriesResponse,
  InscriptionsResponse,
  UsersResponse,
} from "../../../models/backlessResponse";
import { Course, Group, Schedule } from "../../../models/courseCategory";
import { StudentForm } from "./studentForm";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { InscriptionModel } from "../../../models/inscriptionModel";
import { Sesion } from "backless";
import { ScoreTable } from "../../myClasses/components/scoreComponent";
import { StudentCard } from "./studentCard";

interface Props {
  group: Group;
  onBack: () => void;
  category: CategoriesResponse;
  course: Course;
}

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const AdminGroup = ({ group, onBack, category, course }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);

  const addStudent = async (data: UsersResponse) => {
    group.students.push(data.properties.username);
    var response = await dbConnect()?.editDocument(
      Collections.CATEGORIES,
      category.id,
      category
    );
    const newInscription: InscriptionModel = {
      userId: data.properties.username,
      category: category.properties.name,
      course: course.name,
      group: group.name,
      scores: group.scores,
    };

    if (response) {
      var createInscription = await dbConnect()?.addDocument(
        Collections.INSCRIPTIONS,
        newInscription
      );
      if (createInscription) {
        alert("Estudiante agregado correctamente");
        setShowForm(false);
      } else {
        alert("Error al agregar estudiante");
      }
    } else {
      alert("Error al agregar estudiante");
    }
  };

  useEffect(() => {
    if (!inscriptions) {
      getInscriptions();
    }
  }, []);

  const getInscriptions = async () => {
    setInscriptions(
      (await dbConnect()?.getCollection(Collections.INSCRIPTIONS))?.map(
        (c) => c
      ) as InscriptionsResponse[]
    );
  };

  return (
    <>
      {!showForm ? (
        <div style={styles.mainContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Gestión de Grupo</h2>
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
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#6B7280")
            }
          >
            ←
          </button>

          {/* Información del grupo */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <p>
                <strong>Nombre del grupo:</strong> {group.name}
              </p>
              <p>
                <strong>Profesor:</strong> {group.teacher}
              </p>
              <p>
                <strong>Horario:</strong>
              </p>
              <ul style={{ paddingLeft: "1rem" }}>
                {group.schedule.map((item: Schedule, index) => (
                  <li key={index}>
                    {dayNames[item.day]}: {item.init} - {item.end}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Listado de estudiantes */}
          <h3
            style={{
              marginTop: "2rem",
              marginBottom: "1rem",
              fontSize: "1.25rem",
              color: "#111827",
            }}
          >
            Estudiantes del grupo
          </h3>

          <div
            style={{
              maxHeight: "300px", // puedes ajustar este valor según lo que te convenga
              overflowY: "auto",
              paddingRight: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div style={styles.grid}>
              {group.students.length > 0 ? (
                group.students.map((student: string) => (
                  <StudentCard student={student} inscriptions={inscriptions!} category={category} course={course} group={group}></StudentCard>
                ))
              ) : (
                <p style={{ color: "#6b7280" }}>
                  No hay estudiantes en este grupo.
                </p>
              )}
            </div>
          </div>

          {/* Botón para agregar nuevo estudiante */}
          <button
            style={{ ...styles.button, marginTop: "1rem" }}
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
            + Nuevo estudiante
          </button>
        </div>
      ) : (
        <StudentForm
          addStudent={addStudent}
          onBack={() => setShowForm(false)}
          group={group}
          category={category}
        ></StudentForm>
      )}
    </>
  );
};
