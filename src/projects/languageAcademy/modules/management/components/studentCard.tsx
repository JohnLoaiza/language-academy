import React, { useState } from "react";
import { ScoreTable } from "../../myClasses/components/scoreComponent";
import {
  CategoriesResponse,
  InscriptionsResponse,
} from "../../../models/backlessResponse";
import { Activity, Course, Group } from "../../../models/courseCategory";
import { styles } from "../../../../../styles";
import { ScoreModel } from "../../../models/scoreModel";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { ActivityList } from "../../myClasses/components/activityList";

interface StudentCardProps {
  student: string;
  inscriptions: InscriptionsResponse[];
  category: CategoriesResponse;
  course: Course;
  group: Group;
  onSelectActivity?: (activity: Activity, inscription: InscriptionsResponse) => void
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  inscriptions,
  category,
  course,
  group,
  onSelectActivity
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [localScores, setLocalScores] = useState<ScoreModel[] | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Extraer la inscripción completa
  const inscription = inscriptions?.find(
    (i) =>
      i.properties.userId === student &&
      i.properties.category === category.properties.name &&
      i.properties.course === course.name &&
      i.properties.group === group.name
  );

  const originalScores = inscription?.properties.scores;

  const toggleScoreTable = () => {
    setIsVisible(!isVisible);
    if (!isVisible && originalScores) {
      setLocalScores(JSON.parse(JSON.stringify(originalScores))); // Clon profundo
      setHasChanges(false);
    }
  };

  const handleScoresChange = (updatedScores: ScoreModel[]) => {
    setLocalScores(updatedScores);
    const hasDiff = originalScores?.some(
      (orig, idx) => orig.finalValue !== updatedScores[idx]?.finalValue
    );
    setHasChanges(!!hasDiff);
  };

  const handleConfirmChanges = async () => {
    if (inscription && localScores) {
      // Actualizar los scores dentro de la inscripción
      const updatedInscription = {
        ...inscription,
        properties: {
          ...inscription.properties,
          scores: localScores
        }
      };
    
      const response = await dbConnect()?.editDocument(
        Collections.INSCRIPTIONS,
        inscription.id,
        updatedInscription
      );
    
      if (response) {
        alert("Cambios guardados");
      } else {
        alert("No se pudo realizar los cambios");
      }
      setHasChanges(false);
    }
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
      onClick={toggleScoreTable}
    >
      <div style={styles.cardTitle}>{student}</div>
      {isVisible && localScores && inscription && (
        <div onClick={(e) => e.stopPropagation()}>
          <ScoreTable
            editable={true}
            scores={localScores}
            onScoresChange={handleScoresChange}
          />
          {hasChanges && (
            <button
              onClick={handleConfirmChanges}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirmar cambios
            </button>
          )}
          <ActivityList activities={group.activities!} inscription={inscription} onSelectActivity={onSelectActivity!}></ActivityList>
        </div>
      )}
    </div>
  );
};
