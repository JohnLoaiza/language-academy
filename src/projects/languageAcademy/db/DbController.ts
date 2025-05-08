import { dbConnect } from ".";
import { CategoriesResponse, InscriptionsResponse, UsersResponse } from "../models/backlessResponse";
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

  static getUsers = async (): Promise<UsersResponse[]> => {
    return (await dbConnect()?.getCollection(Collections.USERS))?.map(
      (c) => c
    ) as UsersResponse[];
  };
}
