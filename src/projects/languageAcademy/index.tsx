import { Project } from "../../utils/backlessLibrary/multiProjectLibrary/projectsManager/objects/project";
import { Management } from "./modules/management";
import { MyClasses } from "./modules/myClasses";
import { MyCourses } from "./modules/myCourses";
import { Users } from "./modules/users";


export enum Modules {
    management = "management",
    myClasses = "myClasses",
    myCourses = "myCourses"
}

export const languageAcademy: Project = new Project(
    {name: 'languageAcademy',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users", component: <Users/>},
                 {name: Modules.management, component: <Management/>}, ]},
            {name: "Teacher", authorizedModules: [{name: Modules.myCourses, component: <MyCourses/>} ]},
            {name: "Student", authorizedModules: [{name: Modules.myClasses, component: <MyClasses/>}]}
        ]
    }
)


export const languageAcademyMarketing: Project = new Project(
    {name: 'languageAcademyMarketing',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users", component: <Users/>},
                 {name: Modules.management, component: <Management/>}, ]},
            {name: "Teacher", authorizedModules: [{name: Modules.myCourses, component: <MyCourses/>} ]},
            {name: "Student", authorizedModules: [{name: Modules.myClasses, component: <MyClasses/>}]}
        ]
    }
)