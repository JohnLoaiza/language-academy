import { DatabaseController } from "../../../utils/backlessLibrary/multiProjectLibrary/databaseManager/databaseController"
import { Admin } from "../../../utils/backlessLibrary/multiProjectLibrary/projectsManager"


export   const dbConnect = () : DatabaseController | undefined => {
    try {
       return Admin.projectSelected?.dbConnect
    } catch (error) {
        return undefined
    }
}
