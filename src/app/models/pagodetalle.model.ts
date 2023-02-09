import { Cuota } from "./cuota.model";
import { Pago } from "./pago.model";

export class Pagodetalle {
    constructor(
        public _id:string,
        public idpago:Pago,
        public idcuota:Cuota,
        public fechageneracion:Date,
        public monto:number,
        public estatus:boolean
    ){}
}