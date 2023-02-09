import {Compania } from '../models/compania.model';

interface  IUsuario{
     companiaID: string,
     name: string, 
     email: string, 
     password?: string, 
     img?: string,
     google?: boolean, 
     role?: string,  
     uid?: string
}

export class Empleado{
   
    constructor(
        public _id:string,
        public identificacion:string,
        public name1:string,
        public name2:string,
        public apell1:string,
        public apell2:string,
        public email:string,
        public fechaIngreso:Date,
        public salario:number,
        public img:string,
        public usuario:IUsuario,
        public companiaID:Compania,
        public fechaSalida?:Date
    ){}

}    
