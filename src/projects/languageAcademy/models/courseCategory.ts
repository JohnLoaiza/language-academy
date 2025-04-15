export interface Schedule {
    day: number;
    init: string;
    end: string;
  }
  
  export interface Group {
    name: string;
    teacher: string;
    schedule: Schedule[];
    students: string[];
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
  