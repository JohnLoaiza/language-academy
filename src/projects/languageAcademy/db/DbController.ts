import { dbConnect } from ".";
import { CategoriesResponse, InscriptionsResponse } from "../models/backlessResponse";
import { Collections } from "./collections";

export class DbController {
  static getInscriptions = async (): Promise<InscriptionsResponse[]> => {
    return (await dbConnect()?.getCollection(Collections.INSCRIPTIONS))?.map(
      (c) => c
    ) as InscriptionsResponse[];
  };

  static getCategories = async (): Promise<CategoriesResponse[]> => {
    return (await dbConnect()?.getCollection(Collections.CATEGORIES))?.map(
      (c) => c
    ) as CategoriesResponse[];
  };
}
