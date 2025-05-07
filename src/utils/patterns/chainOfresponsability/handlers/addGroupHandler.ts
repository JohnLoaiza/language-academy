import { Group } from "../../../../projects/languageAcademy/models/courseCategory";
import { BaseHandler } from "../basehandler";
import { GroupCreationContext } from "../contexts/GroupCreationContext";

export class AddGroupHandler extends BaseHandler {
  async handle(context: GroupCreationContext): Promise<boolean> {
    const { user, name, schedules, scores, category, course } = context;

    const newGroup: Group = {
      name,
      teacher: user.properties.username,
      schedule: schedules,
      students: [],
      scores,
      attendance: [],
      remedials: [],
      activities: [],
    };

    const targetCourse = category.properties.courses.find((c) => c.name === course.name);
    if (!targetCourse) return false;

    targetCourse.groups.push(newGroup);
    return await super.handle(context);
  }
}
