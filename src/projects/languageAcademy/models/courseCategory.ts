import { ScoreModel } from "./scoreModel";

export interface Schedule {
    day: number;
    init: string;
    end: string;
  }

  export interface AttendanceRecord {
    student: string,
    present: boolean
  }

  export interface Attendance {
    date: string,
    records: AttendanceRecord[]
  }
  
  export interface Group {
    name: string;
    teacher: string;
    schedule: Schedule[];
    students: string[];
    scores: ScoreModel[],
    attendance: Attendance[]
  }
  
  export interface Course {
    name: string;
    description: string;
    initDate: string;
    endDate: string;
    groups: Group[];
  }
  
  export interface CourseCategory {
    name: string;
    courses: Course[];
  }
  