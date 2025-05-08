import { User } from "../databaseManager/frontServices/dashboard";
import { Module } from "../projectsManager/models/moduleModel";

export type SesionProps = {
    user: User;
    jwt: string;
    time: number;
    logged: boolean;
    authorizeModules: Module[]
}

export abstract class Sesion {
   static props: SesionProps;

   static initSesion (props: SesionProps) : boolean {
        this.props = props;
        return true;
   }

   static addAllModules(modules: Module[]) {
    this.props.authorizeModules =  {...this.props.authorizeModules, ...modules}
    }
}