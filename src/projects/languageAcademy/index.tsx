import { Project } from "backless";
import { Management } from "./modules/management";
import { MyClasses } from "./modules/myClasses";
import { MyCourses } from "./modules/myCourses";


export enum Modules {
    management = "management",
    myClasses = "myClasses",
    myCourses = "myCourses"
}

export const languageAcademy: Project = new Project(
    {name: 'languageAcademy',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users"},
                 {name: Modules.management, component: <Management/>},  {name: 'categories'}]},
            {name: "Teacher", authorizedModules: [{name: Modules.myCourses, component: <MyCourses/>} ]},
            {name: "Student", authorizedModules: [{name: Modules.myClasses, component: <MyClasses/>}]}
        ]
    }
)