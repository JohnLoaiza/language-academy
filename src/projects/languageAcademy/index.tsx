import { Project } from "backless";
import { Management } from "./modules/management";
import { MyClasses } from "./modules/myClasses";


export enum Modules {
    management = "management",
    myClasses = "myClasses"
}

export const languageAcademy: Project = new Project(
    {name: 'languageAcademy',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users"},
                 {name: Modules.management, component: <Management/>},  {name: 'categories'}]},
            {name: "Teacher", authorizedModules: [{name: "My courses"} ]},
            {name: "Student", authorizedModules: [{name: Modules.myClasses, component: <MyClasses/>}]}
        ]
    }
)