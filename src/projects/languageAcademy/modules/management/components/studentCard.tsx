import React, { useState } from "react";
import { ScoreTable } from "../../myClasses/components/scoreComponent";
import { CategoriesResponse, InscriptionsResponse } from "../../../models/backlessResponse";
import { Course, Group } from "../../../models/courseCategory";
import { styles } from "../../../../../styles";

interface StudentCardProps {
  student: string;
  inscriptions: InscriptionsResponse[];
  category: CategoriesResponse;
  course: Course;
  group: Group;
}



export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  inscriptions,
  category,
  course,
  group,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para manejar el toggle de visibilidad
  const toggleScoreTable = () => {
    setIsVisible(!isVisible);
  };

  // Buscar las calificaciones del estudiante
  const scores = inscriptions?.find(
    (i) =>
      i.properties.userId === student &&
      i.properties.category === category.properties.name &&
      i.properties.course === course.name &&
      i.properties.group === group.name
  )?.properties.scores;

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
      onClick={toggleScoreTable} // Al hacer clic se alterna la visibilidad
    >
      <div style={styles.cardTitle}>{student}</div>
      {isVisible && scores && (
        <ScoreTable scores={scores} />
      )}
    </div>
  );
};
