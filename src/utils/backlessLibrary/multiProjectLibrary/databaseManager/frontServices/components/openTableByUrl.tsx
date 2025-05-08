import { useParams } from "react-router-dom";
import '../../../databaseManager/utils/styles.css';
import Table from "../tableView";

export const OpenTable: React.FC = () => {
  // Obtiene los parámetros de la ruta
  const { project, collection } = useParams<{
    project: string;
    collection: string;
  }>();
  
  return (
    <div className={'content'}>
      <Table
        project={project!}
        collection={collection!}
      ></Table>
      
    </div>
  );
};
