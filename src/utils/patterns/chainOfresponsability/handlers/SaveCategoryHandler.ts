import { dbConnect } from "../../../../projects/languageAcademy/db";
import { Collections } from "../../../../projects/languageAcademy/db/collections";
import { BaseHandler } from "../basehandler";
import { GroupCreationContext } from "../contexts/GroupCreationContext";


export class SaveCategoryHandler extends BaseHandler {
  async handle(context: GroupCreationContext): Promise<boolean> {
    const { category } = context;
    const response = await dbConnect()?.editDocument(Collections.CATEGORIES, category.id, category);
    if (!response) return false;

    return await super.handle(context);
  }
}
