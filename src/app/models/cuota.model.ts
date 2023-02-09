import { Apartamento } from "./apartamento.model"

export class Cuota {
    constructor(
        public _id:string,
        public idapartamento:Apartamento,
        public fechageneracion:Date,
        public fechacuota:Date,
        public monto:number,
        public saldo:number,
        public estatus:boolean,
        public senal:string,
        public motivo:string
    ){}
}