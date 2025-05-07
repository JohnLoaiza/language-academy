import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { CategoriesResponse } from "../../../models/backlessResponse";


export const useManagmentController = () => {

  const getCategories = async () : Promise<CategoriesResponse[]> => {
   return (await dbConnect()?.getCollection(Collections.CATEGORIES))?.map((c: any) => c) as CategoriesResponse[]
  };

 return {getCategories}
} 