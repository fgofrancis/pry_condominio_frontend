import {IIngresosExentoISR, IOtrasRemuneraciones,
        ISalarioCotizableTSS} from './asignacion.model'
import {IRetencionesLey,IOtrasDeducciones } from './deduccion.model'


interface IEmpleado{
    _id:string,
    name1: string,
    apell1: string,
    sal: number,
    // salario: number,debo resolver el tema del alias en el backend
};

interface IAsignacion {
    salarioCotizableTSS:ISalarioCotizableTSS,
    otrasRemuneraciones:IOtrasRemuneraciones,
    ingresosExentoISR:IIngresosExentoISR,
    reembolsos: number,
    fechaRegistro:Date
};

interface IDeduccion {
    retencionesLey:IRetencionesLey,
    otrasDeducciones:IOtrasDeducciones,
    fechaRegistro:Date
};

export class NominaDetalle{

    constructor(
        public identificacion: string,
        public empleadoID: IEmpleado,
        public asignacionID: IAsignacion,
        public deduccionID:IDeduccion,
    ){}
}

