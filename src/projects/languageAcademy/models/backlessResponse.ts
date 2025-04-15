import { CourseCategory } from "./courseCategory"

export interface BacklessResponse {
        id: string,
        properties: any
}

export interface CategoriesResponse {
    id: string,
    properties: CourseCategory
}