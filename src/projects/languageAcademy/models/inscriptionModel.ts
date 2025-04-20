import { ScoreModel } from "./scoreModel";

export interface InscriptionModel {
    studentId: string,
    category: string,
    course: string,
    group: string,
    scores: ScoreModel[]

}