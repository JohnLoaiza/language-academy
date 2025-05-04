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

  export interface RemedialRequest {
    id: string;
    student: string; // username o userId
    requestedAt: string; // ISO date string
    status: "pendiente" | "aceptada" | "rechazada" | "resuelta";
    instructions?: string; // Qué debe hacer el estudiante (rellenado por el profe)
    studentResponse?: string; // Lo que responde el estudiante
    resolvedAt?: string; // Cuando el profe lo marca como resuelto
  }

  export interface Group {
    name: string;
    teacher: string;
    schedule: Schedule[];
    students: string[];
    scores: ScoreModel[],
    attendance: Attendance[],
    remedials: RemedialRequest[]
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
  