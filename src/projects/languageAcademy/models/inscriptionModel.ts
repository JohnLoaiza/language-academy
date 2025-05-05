import { Activity } from "./courseCategory";
import { ScoreModel } from "./scoreModel";

export interface InscriptionModel {
    userId: string,
    category: string,
    course: string,
    group: string,
    scores: ScoreModel[],
    activities?: Activity[]; // ✅ Agregado aquí
}