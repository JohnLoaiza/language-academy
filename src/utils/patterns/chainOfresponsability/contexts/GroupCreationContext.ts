import { CategoriesResponse, UsersResponse } from "../../../../projects/languageAcademy/models/backlessResponse";
import { Course } from "../../../../projects/languageAcademy/models/courseCategory";
import { ScoreModel } from "../../../../projects/languageAcademy/models/scoreModel";
import { ScheduleItem } from "../../../../projects/languageAcademy/modules/management/components/groupForm";


export interface GroupCreationContext {
  user: UsersResponse;
  name: string;
  schedules: ScheduleItem[];
  scores: ScoreModel[];
  category: CategoriesResponse;
  course: Course;
}
