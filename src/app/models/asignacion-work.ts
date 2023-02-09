
export class AsignacionWork{
    constructor(
        public _id:string,
        public nombre:string,
        public salarioCotizableTSS: number,
        public otrasRemuneraciones:number, 
        public ingresosExentoISR:number,
        public otroReembolso: number,
        public totalAsignacion: number
    ){}
}
