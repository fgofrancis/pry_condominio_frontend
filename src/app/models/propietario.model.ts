
export interface  ITelefono {
    casa:string,
    trabajo:string,
    celular:string
}

export class Propietario {
    constructor(
        public _id:string,
        public identificacion:string,
        public nombre:number,
        public telefonos:ITelefono,
        public direccion:string,
        public estatus:boolean,
    ){}
}