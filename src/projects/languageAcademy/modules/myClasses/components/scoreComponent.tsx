import React, { useState, useEffect } from "react";
import { ScoreModel } from "../../../models/scoreModel";

interface ScoreTableProps {
  scores: ScoreModel[];
  editable?: boolean; // Nuevo prop
  onScoresChange?: (updatedScores: ScoreModel[]) => void; // Callback opcional
}

const styles = {
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "bold" as const,
    marginBottom: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "0.9rem",
  },
  thStyle: {
    padding: "8px",
    textAlign: "left" as const,
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
  },
  tdStyle: {
    padding: "8px",
    textAlign: "left" as const,
    borderBottom: "1px solid #e5e7eb",
  },
  input: {
    width: "60px",
    padding: "4px",
    fontSize: "0.9rem",
  },
};

export const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  editable = false,
  onScoresChange,
}) => {
  const [localScores, setLocalScores] = useState<ScoreModel[]>([]);

  useEffect(() => {
    setLocalScores(scores);
  }, [scores]);

  const handleScoreChange = (index: number, value: string) => {
    const updatedScores = [...localScores];
    const numericValue = Math.min(Math.max(parseFloat(value), 0), 5); // Limitar entre 0 y 5
    updatedScores[index].finalValue = isNaN(numericValue) ? 0 : numericValue;
    setLocalScores(updatedScores);
    if (onScoresChange) onScoresChange(updatedScores);
  };

  const totalWeight = localScores.length;
  const weightedSum = localScores.reduce((acc, score) => acc + (score.finalValue ?? 0), 0);
  const finalResult = (weightedSum / totalWeight).toFixed(2);

  return (
    <div style={styles.container}>
      <p style={styles.title}>Calificaciones:</p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thStyle}>Título</th>
            {localScores.map((score, index) => (
              <th key={index} style={styles.thStyle}>
                {score.title + " (" + score.pourcentage + "%)"}
              </th>
            ))}
            <th style={styles.thStyle}><strong>Acumulado</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tdStyle}>Notas</td>
            {localScores.map((score, index) => (
              <td key={index} style={styles.tdStyle}>
                {editable ? (
                  <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={score.finalValue ?? 0}
                  onClick={(e) => e.stopPropagation()} // 👈 esto evita que se dispare el onClick del contenedor padre
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  style={styles.input}
                />                
                ) : (
                  score.finalValue ?? 0
                )}
              </td>
            ))}
            <td style={styles.tdStyle}>
              <strong>{finalResult} / 5.0</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
