import { Apartamento } from "./apartamento.model"
import { Formapago} from "./formapago.model"


export class Pago {
    constructor(
        public _id:string,
        public idapartamento:Apartamento,
        public fechageneracion:Date,
        public monto:number,
        public idformapago:Formapago,
        // public formapago:string,
        public estatus:boolean,
        public saldoantedelpago:number,
        public saldodespuesdelpago:number,     
    ){}
}