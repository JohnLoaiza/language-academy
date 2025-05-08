import React from "react";
import { useParams } from "react-router-dom";
import { PrivateAdmin } from "..";
import ProtectedRoute from "./ProtectedRoute";

interface InicialiceProjectProps {
  element: React.ReactNode;
  protected?: boolean 
}

const InicialiceProject: React.FC<InicialiceProjectProps> = (props) => {
  const { project = "NA" } = useParams<{
    project: string;
  }>();
console.log('Entra a inicializar');
console.log('project es');
console.log(project);


 console.log('project son');
 console.log(PrivateAdmin.projectsAdmin());
 
  const projectName = PrivateAdmin.validProject(project);
  console.log('sale');
  
  if (projectName) {
    console.log('es valido');
    
    const projectLoad = PrivateAdmin.setProjectSelected(project);
    if (projectLoad) {
      return props.protected? <ProtectedRoute element={props.element} /> : props.element;
    }
  } else {
  return  <>No existe el projecto {project}</>;
  }
};

export default InicialiceProject;
