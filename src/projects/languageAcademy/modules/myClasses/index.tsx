import { useEffect, useState } from "react";
import {
  CategoriesResponse,
  InscriptionsResponse,
} from "../../models/backlessResponse";
import { styles } from "../../../../styles";
import { Sesion } from "backless";
import { ScoreTable } from "./components/scoreComponent";
import { DbController } from "../../db/DbController";
import { dbConnect } from "../../db";
import { Collections } from "../../db/collections";
import {
  Group,
  RemedialRequest,
  Activity,
} from "../../models/courseCategory";
import { ActivitySubmissionView } from "./components/activitySubmission";
import { ActivityList, btnStyle } from "./components/activityList";
import { RemedialList } from "../management/components/remedialList";

type ShowLeveling = {
  remedials: RemedialRequest[];
  group: Group;
};

export const MyClasses = () => {
  const [inscriptions, setInscriptions] = useState<
    InscriptionsResponse[] | undefined
  >(undefined);
  const [categories, setCategories] = useState<
    CategoriesResponse[] | undefined
  >(undefined);
  //const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedInscription, setSelectedInscription] =
    useState<InscriptionsResponse | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesResponse | null>(null);

  const [showLeveling, setShowLeveling] = useState<ShowLeveling | undefined>(
    undefined
  );

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

  const selectActivity = (
    activity: Activity,
    inscription: InscriptionsResponse
  ) => {
    console.log("inscription es");
    console.log(inscription);
    setSelectedInscription(inscription);
    setSelectedActivity(activity);
  };

  const findGroup = (
    category: string,
    course: string,
    group: string
  ): Group | undefined => {
    try {
      const findedCategory = categories?.find(
        (c) => c.properties.name === category
      );
      const findedCourse = findedCategory?.properties.courses.find(
        (c) => c.name === course
      );
      return findedCourse?.groups.find((g) => g.name === group);
    } catch {
      return;
    }
  };

  const handleNivelacion = async (
    category: string,
    course: string,
    group: string
  ) => {
    const findedCategory = categories?.find(
      (c) => c.properties.name === category
    );
    const findedCourse = findedCategory?.properties.courses.find(
      (c) => c.name === course
    );
    const findedGroup = findedCourse?.groups.find((g) => g.name === group);

    if (findedGroup) {
      const remedialRequest: RemedialRequest = {
        id: Sesion.props.user.username + Date.now(),
        requestedAt: new Date().toISOString(),
        status: "pendiente",
        student: Sesion.props.user.username,
        instructions: "",
        resolvedAt: "",
        studentResponse: "",
      };
      findedGroup.remedials ??= [];
      findedGroup.remedials.push(remedialRequest);

      const response = await dbConnect()?.editDocument(
        Collections.CATEGORIES,
        findedCategory?.id!,
        findedCategory
      );
      alert(
        response ? "Nivelación solicitada" : "No se pudo enviar la solicitud"
      );
    }
  };

  return (
    <div className="" style={{ width: "75vw", position: "relative" }}>
      {/* Subpantalla de entrega */}
      {selectedActivity && selectedInscription && (
        <ActivitySubmissionView
          inscription={selectedInscription!}
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        ></ActivitySubmissionView>
      )}

      {/* Contenido principal */}
      <div style={styles.mainContainer}>
        <>
          {showLeveling ? (
            <>
              <RemedialList
                remedials={showLeveling.remedials}
                group={showLeveling.group}
                category={selectedCategory!}
                onBack={() => setShowLeveling(undefined)}
              ></RemedialList>
            </>
          ) : (
            <>
              <div style={styles.header}>
                <h2 style={styles.title}>Mis clases</h2>
              </div>

              <div>
                {inscriptions?.map((iRes) => {
                  const i = iRes.properties;
                  const group = findGroup(i.category, i.course, i.group);
                  const userId = Sesion.props.user.username;
                  const hasUserRemedials = group?.remedials?.filter(
                    (r) => r.student === userId
                  );

                  return (
                    <div
                      key={i.group}
                      style={{
                        ...styles.card,
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                        gap: "1rem",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eff6ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "2rem",
                        }}
                      >
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

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          <ScoreTable scores={i.scores} />

                          <button
                            style={btnStyle("#6366f1")}
                            onClick={() =>
                              setSelectedInscription(
                                selectedInscription &&
                                  selectedInscription.id === iRes.id
                                  ? null
                                  : iRes
                              )
                            }
                          >
                            {selectedInscription &&
                            selectedInscription.id === iRes.id
                              ? "Menos"
                              : "Ver"}
                          </button>
                        </div>
                      </div>

                      {selectedInscription &&
                        selectedInscription.id === iRes.id && (
                          <>
                            {hasUserRemedials ? (
                              <button
                                style={btnStyle("#10b981")}
                                onClick={() =>
                                  setShowLeveling({
                                    group: group!,
                                    remedials: hasUserRemedials,
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
                                    i.category,
                                    i.course,
                                    i.group
                                  )
                                }
                              >
                                Solicitar Nivelación
                              </button>
                            )}
                            <ActivityList
                              inscription={iRes}
                              activities={group!.activities}
                              onSelectActivity={selectActivity}
                            ></ActivityList>
                          </>
                        )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
};
