import { useEffect, useState } from "react";
import {
  CategoriesResponse,
  InscriptionsResponse,
} from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { InscriptionModel } from "../../models/inscriptionModel";
import { Sesion } from "backless";
import { ScoreTable } from "./components/scoreComponent";
import { DbController } from "../../db/DbController";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";
import { Course, Group, RemedialRequest } from "../../models/courseCategory";

export const MyClasses = () => {
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);
  const [categories, setCategories] = useState<
    CategoriesResponse[] | undefined
  >(undefined);

  useEffect(() => {
    if (!inscriptions) {
      getInscriptions();
    }
  }, []);

  const getInscriptions = async () => {
    setInscriptions(
      (await DbController.getInscriptions()).filter(
        (i) => i.properties.userId === Sesion.props.user.username
      )
    );
  };

  useEffect(() => {
    if (!categories) {
      getCategories();
    }
  }, []);

  const getCategories = async () => {
    setCategories(
      (await dbConnect()?.getCollection(Collections.CATEGORIES))?.map(
        (c) => c
      ) as CategoriesResponse[]
    );
  };

  const findGroup = (
    category: string,
    course: string,
    group: string
  ): Group | undefined => {
    try {
      const findedCategory: CategoriesResponse | undefined = categories?.find(
        (c) => c.properties.name === category
      );

      const findedCourse: Course | undefined =
        findedCategory?.properties.courses.find((c) => c.name === course);

      return findedCourse?.groups.find((g) => g.name === group);
    } catch (err) {
      return;
    }
  };

  const handleNivelacion = async (category: string,
    course: string,
    group: string) => {
    const findedCategory: CategoriesResponse | undefined = categories?.find(
      (c) => c.properties.name === category
    );

    const findedCourse: Course | undefined =
      findedCategory?.properties.courses.find((c) => c.name === course);

   const findedGroup =  findedCourse?.groups.find((g) => g.name === group);
    if (findedGroup) {
      const remedialRequest : RemedialRequest = {
        id: Sesion.props.user.username + Date.now(),
        requestedAt: new Date().toISOString(),
        status: 'pendiente',
        student: Sesion.props.user.username,
        instructions: '',
        resolvedAt: '',
        studentResponse: ''
      }
      findedGroup.remedials ??= []
      findedGroup.remedials.push(remedialRequest)
      const response = await dbConnect()?.editDocument(Collections.CATEGORIES, findedCategory?.id!, findedCategory)
      if(response) {
        alert('Nivelación solicitada')
      } else {
        alert("No se pudo enviarl a solicitud 2")
      }
    } else {
      alert("No se pudo enviarl a solicitud")
    }
  };

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

                {/* Columna derecha: tabla de calificaciones y botón */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}>
                  <ScoreTable scores={i.scores} />
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNivelacion(i.category, i.course, i.group)}
                  >
                    Solicitar Nivelación
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
