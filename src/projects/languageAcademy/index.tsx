import { Project } from "backless";
import { Management } from "./modules/management";


export enum Modules {
    management = "management",
}

export const languageAcademy: Project = new Project(
    {name: 'languageAcademy',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users"},
                 {name: Modules.management, component: <Management/>},  {name: 'categories'}]},
            {name: "Teacher", authorizedModules: [{name: "My courses"}]},
            {name: "Student", authorizedModules: [{name: "My classes"}]}
        ]
    }
)