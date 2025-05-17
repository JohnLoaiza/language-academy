import { styles } from "../../../../../styles";
import { Group } from "../../../models/courseCategory";

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface GroupCardProps {
  group: Group;
}

const ShowSchedule: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <div style={styles.grid}>
      <div style={{...styles.card, maxWidth: '500px'}}>
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
          {group.schedule.map((item, index) => (
            <li key={index}>
              {dayNames[item.day]}: {item.init} - {item.end}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowSchedule;