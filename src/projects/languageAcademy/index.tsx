import { Project } from "backless";


export const languageAcademy: Project = new Project(
    {name: 'languageAcademy',
        roles: [
            {name: "Admin", authorizedModules: [{name: "users"}]},
            {name: "Teacher", authorizedModules: [{name: "My courses"}]},
            {name: "Student", authorizedModules: [{name: "My classes"}]}
        ]
    }
)