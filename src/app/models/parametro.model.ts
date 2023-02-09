import { Usuario } from "./usuario.model"

interface iSeguroFamiliarSalud{
  tasaEmpleado:number,
  tasaPatron:number
};

interface iSeguroVejezDiscapSobrevivencia{
  tasaEmpleado:number,
  tasaPatron:number
};
export class Parametro{
   constructor(
     public _id: string, 
     public salarioMinPromedio:number,
     public seguroFamiliarSalud:iSeguroFamiliarSalud,
     public seguroVejezDiscapSobrevivencia:iSeguroVejezDiscapSobrevivencia,
     public seguroRiesgoLaboral:number, 
     public salarioMinTSS:number,
     public usuario:Usuario,
     public fechaRegistro:Date
   ){}
}

