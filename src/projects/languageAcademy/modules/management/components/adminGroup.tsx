import { useEffect, useState } from "react";
import { styles } from "../../../../../styles";
import {
  CategoriesResponse,
  InscriptionsResponse,
  UsersResponse,
} from "../../../models/backlessResponse";
import {
  Activity,
  Attendance,
  Course,
  Group,
  Schedule,
} from "../../../models/courseCategory";
import { StudentForm } from "./studentForm";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { InscriptionModel } from "../../../models/inscriptionModel";
import { StudentCard } from "./studentCard";
import { DbController } from "../../../db/DbController";
import { AttendanceForm } from "./attendance";
import { RemedialList } from "./remedialList";
import { ActivityManager } from "./activityManager";
import { ActivitySubmissionView } from "../../myClasses/components/activitySubmission";

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

type ActivitySubmited = {
  inscription: InscriptionsResponse;
  activity: Activity;
};

export const AdminGroup = ({ group, onBack, category, course }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showLeveling, setShowLeveling] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showActivitySubmited, setShowActivitySubmited] = useState<
    ActivitySubmited | undefined
  >(undefined);
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);

  const addStudent = async (data: UsersResponse) => {
    group.students.push(data.properties.username);
    const response = await dbConnect()?.editDocument(
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
      const createInscription = await dbConnect()?.addDocument(
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

  const saveAttendance = (entry: Attendance) => {
    if (!group.attendance) group.attendance = [];
    group.attendance.push(entry);

    dbConnect()
      ?.editDocument(Collections.CATEGORIES, category.id, category)
      .then((res) => {
        if (res) {
          alert("Asistencia guardada");
          setShowAttendance(false);
        } else {
          alert("Error al guardar la asistencia");
        }
      });
  };

  useEffect(() => {
    if (!inscriptions) {
      getInscriptions();
    }
  }, []);

  const getInscriptions = async () => {
    setInscriptions(await DbController.getInscriptions());
  };

  return (
    <div className="" style={{ width: "75vw", position: "relative" }}>
       {/* Subpantalla de entrega */}
       {showActivitySubmited && (
        <ActivitySubmissionView
          inscription={showActivitySubmited.inscription!}
          activity={showActivitySubmited.activity}
          onClose={() => setShowActivitySubmited(undefined)}
        ></ActivitySubmissionView>
      )}
      {!showForm && !showAttendance && !showLeveling && !showActivities && !showActivitySubmited ? ( // AGREGADO
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
              maxHeight: "300px",
              overflowY: "auto",
              paddingRight: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div style={styles.grid}>
              {group.students.length > 0 ? (
                group.students.map((student: string) => (
                  <StudentCard
                    key={student}
                    student={student}
                    inscriptions={inscriptions!}
                    category={category}
                    course={course}
                    group={group}
                    onSelectActivity={(
                      activity: Activity,
                      inscription: InscriptionsResponse
                    ) =>
                      setShowActivitySubmited({
                        activity: activity,
                        inscription: inscription,
                      })
                    }
                  />
                ))
              ) : (
                <p style={{ color: "#6b7280" }}>
                  No hay estudiantes en este grupo.
                </p>
              )}
            </div>
          </div>

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

          <button
            style={{
              ...styles.button,
              marginTop: "1rem",
              backgroundColor: "#2563eb",
            }}
            onClick={() => setShowAttendance(true)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1d4ed8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
          >
            Tomar asistencia
          </button>

          <button
            style={{
              ...styles.button,
              marginTop: "1rem",
              backgroundColor: "#10b981",
            }}
            onClick={() => setShowLeveling(true)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#059669")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#10b981")
            }
          >
            Ver nivelaciones
          </button>

          <button
            style={{
              ...styles.button,
              marginTop: "1rem",
              backgroundColor: "#8b5cf6",
            }}
            onClick={() => setShowActivities(true)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#7c3aed")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#8b5cf6")
            }
          >
            Ver actividades
          </button>
        </div>
      ) : showForm ? (
        <StudentForm
          addStudent={addStudent}
          onBack={() => setShowForm(false)}
          group={group}
          category={category}
        />
      ) : showAttendance ? (
        <AttendanceForm
          students={group.students}
          onSave={saveAttendance}
          onBack={() => setShowAttendance(false)}
          pastAttendance={group.attendance}
        />
      ) : showLeveling ? (
        <RemedialList
          remedials={group.remedials ?? []}
          onBack={() => setShowLeveling(false)}
          category={category}
          group={group}
        />
      ) : (
        <ActivityManager
          group={group}
          category={category}
          onBack={() => setShowActivities(false)}
        />
      )}
    </div>
  );
};
