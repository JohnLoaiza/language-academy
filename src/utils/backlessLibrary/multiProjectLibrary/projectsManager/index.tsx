import {
  MainRoutes,
  Params,
  routes,
} from "../routesManager/multiProjectRoutes";
import { Project } from "./objects/project";

export abstract class PrivateAdmin {
  private static PROJECTS: Project[] = [];


  static setProjectSelected = (project: string): boolean => {
    Admin.projectSelected = this.getProject(project);
    return true;
  };

  static generateProjectRoute(route: MainRoutes, module?: string): string {
    return routes[route]
      .replace(Params.COLLECTION, module ?? "")
      .replace(Params.MODULE, module ?? "")
      .replace(Params.PROJECT, Admin.projectSelected?.props.name!);
  }

  static addProject(newProject: Project): void {
    this.PROJECTS.push(newProject);
  }

  static projectsAdmin = (): Project[] => {
    return this.PROJECTS;
  };

  static validProject = (projectName: string) : boolean => this.PROJECTS.map(p => p.props.name).filter(p => p === projectName).length > 0;

  static getProject = (project: string): Project | undefined => {
    console.log("va a traer proyecto " + project);
    console.log("base de proyectos");
    return this.PROJECTS.find((p) => p.props.name === project);
  };
}


export class Admin {
  static projectSelected?: Project;
}