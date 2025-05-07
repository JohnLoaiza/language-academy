import { dbConnect } from "../../../../projects/languageAcademy/db";
import { Collections } from "../../../../projects/languageAcademy/db/collections";
import { InscriptionModel } from "../../../../projects/languageAcademy/models/inscriptionModel";
import { BaseHandler } from "../basehandler";
import { GroupCreationContext } from "../contexts/GroupCreationContext";


export class CreateInscriptionHandler extends BaseHandler {
  async handle(context: GroupCreationContext): Promise<boolean> {
    const { user, name, course, category } = context;

    const newInscription: InscriptionModel = {
      userId: user.properties.username,
      category: category.properties.name,
      course: course.name,
      group: name,
      scores: [],
    };

    const createInscription = await dbConnect()?.addDocument(Collections.INSCRIPTIONS, newInscription);
    if (!createInscription) return false;

    return await super.handle(context);
  }
}
