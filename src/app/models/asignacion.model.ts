import { Empleado } from "./empleado.model";
import { Usuario } from "./usuario.model";

export interface  ISalarioCotizableTSS {
    salario:number,
    comisiones?:number,
    vacaciones?:number
}
 
export interface IOtrasRemuneraciones {
    horasExtraDiasFeriados?:number,
    otrosIngresos?:number,
    bonosTrimestrales?:number
}

export interface  IIngresosExentoISR {
    regaliaPascual?:number,
    indemnizacionesLaborales?:number,
    preavisoYCesantia?:number
}

export class Asignacion{

    constructor(
        public _id:string,
        public empleado:Empleado,
        public salarioCotizableTSS:ISalarioCotizableTSS,
        public otrasRemuneraciones:IOtrasRemuneraciones,
        public ingresosExentoISR:IIngresosExentoISR,
        public reembolsos:number,
        public fechaRegistro:Date
       
        
    ){}
}
//uid
//public fechaRegistro: Date