import { PrivateAdmin } from "..";
import { DatabaseController } from "../../databaseManager/databaseController";
import { ProjectPropierties, Rol } from "../models/ProjectPropiertiesModel";

 export class Project {
  props: ProjectPropierties;
  dbConnect: DatabaseController
   constructor(props: ProjectPropierties) {
    this.props = props;
    this.dbConnect = new DatabaseController(props.name);
  }

  nameToUrl = (): string => "/" + this.props.name;

  initProyect() {
    PrivateAdmin.addProject(this);
  }

  static instance = (
    project: string,
    roles: Rol[]
  ): Project => {
    return new Project({
      name: project,
      roles: roles 
    })
  };
}


