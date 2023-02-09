

export class Bloque {
    constructor(
        public _id:string,
        public codigo:string,
        public cuota:number,
        public tipo:string,
        public ubicacion:string,
        public estatus:boolean,
    ){}
}