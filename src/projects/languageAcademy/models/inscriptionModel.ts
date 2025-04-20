import { ScoreModel } from "./scoreModel";

export interface InscriptionModel {
    userId: string,
    category: string,
    course: string,
    group: string,
    scores?: ScoreModel[]

}