import { useEffect, useState } from "react";
import {
  CategoriesResponse,
  InscriptionsResponse,
} from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { InscriptionModel } from "../../models/inscriptionModel";
import { DbController } from "../../db/DbController";
import { Course, Group } from "../../models/courseCategory";
import { AdminGroup } from "../management/components/adminGroup";
import { Sesion } from "../../../../utils/backlessLibrary/multiProjectLibrary/sesionManager";

export const MyCourses = () => {
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);

  const [categories, setCategories] = useState<
    CategoriesResponse[] | undefined
  >(undefined);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesResponse>();
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [selectedGroup, setSelectedGroup] = useState<Group>();

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
    setCategories(await DbController.getCategories());
  };

  const selectGroup = (category: string, course: string, group: string) => {
    try {
      const findedCategory: CategoriesResponse | undefined = categories?.find(
        (c) => c.properties.name === category
      );
  
      setSelectedCategory(findedCategory);
  
      const findedCourse: Course | undefined =
        findedCategory?.properties.courses.find((c) => c.name === course);
  
      setSelectedCourse(findedCourse);
  
      const findedGroup: Group | undefined = findedCourse?.groups.find(
        (g) => g.name === group
      );
  
      setSelectedGroup(findedGroup);
    } catch (err) {
      alert('Error al abrir el grupo')
    }
  };

  return (
    <div className="" style={{ width: "75vw" }}>
      <div style={styles.mainContainer}>
        {!selectedGroup ? (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>Cursos</h2>
            </div>
            <div>
              {inscriptions
                ?.map((i: InscriptionsResponse) => i.properties)
                .map((i: InscriptionModel) => (
                  <div
                    key={i.course}
                    style={{
                      ...styles.card,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "1rem",
                      gap: "2rem",
                    }}
                    onClick={() => selectGroup(i.category, i.course, i.group)}
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
                    <div style={{ flex: 1 }}></div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <AdminGroup group={selectedGroup!} onBack={() => setSelectedGroup(undefined)} category={selectedCategory!} course={selectedCourse!}></AdminGroup>
        )}
      </div>
    </div>
  );
};
