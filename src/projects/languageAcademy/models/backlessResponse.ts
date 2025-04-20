import { CourseCategory } from "./courseCategory"
import { InscriptionModel } from "./inscriptionModel"
import { User } from "./user"

export interface BacklessResponse {
        id: string,
        properties: any
}

export interface CategoriesResponse {
    id: string,
    properties: CourseCategory
}

export interface UsersResponse {
    id: string,
    properties: User
}

export interface InscriptionsResponse {
    id: string,
    properties: InscriptionModel
}