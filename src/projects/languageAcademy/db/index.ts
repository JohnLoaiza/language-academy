import { Admin, DatabaseController } from "backless";


export   const dbConnect = () : DatabaseController | undefined => {
    try {
       return Admin.projectSelected?.dbConnect
    } catch (error) {
        return undefined
    }
}
