import { Module } from "./moduleModel";

export  type ProjectPropierties = {
    name: string;
    roles: Rol[];
  };
  
  export type Rol = {
   name: string 
   authorizedModules: Module[]
  }