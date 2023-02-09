import { Bloque } from "./bloque.model";
import { Propietario } from "./propietario.model";
import { Usuario } from "./usuario.model";


export class Apartamento {
    constructor(
        public _id:string,
        public codigo:string,
        public planta:number,
        public idbloque:Bloque,
        public saldomantenimiento:number,
        public idpropietario:Propietario,
        public habitado:string,
        public fechaultimacuota:Date,
        public estatus:boolean,
        public usuario:Usuario,
    ){}
}