import React from "react";
import { ScoreModel } from "../../../models/scoreModel";

interface ScoreTableProps {
  scores: ScoreModel[];
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
};

export const ScoreTable: React.FC<ScoreTableProps> = ({ scores }) => {
  // Calcular el resultado final ponderado
  const totalWeight = scores.length;
  const weightedSum = scores.reduce((acc, score) => acc + (score.finalValue ?? 0), 0);
  
  // El resultado final se calcula como la suma ponderada y se normaliza al rango de 0 a 5
  const finalResult = (weightedSum / totalWeight).toFixed(2);

  return (
    <div style={styles.container}>
      <p style={styles.title}>Calificaciones:</p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thStyle}>Título</th>
            {scores.map((score, index) => (
              <th key={index} style={styles.thStyle}>
                {score.title + ' (' + score.pourcentage + '%)'}
              </th>
            ))}
             <th style={styles.tdStyle}><strong>Acumulado</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tdStyle}>Notas</td>
            {scores.map((score, index) => (
              <td key={index} style={styles.tdStyle}>
                {score.finalValue ?? 0}
              </td>
            ))}
            <td colSpan={scores.length} style={styles.tdStyle}>
              <strong>{finalResult} / 5.0</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
