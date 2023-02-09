
export class Procesocuota {
    constructor (
        public _id:string,
        public fechaproceso: Date,
        public estatus:boolean 
    )
    {}

    // Denny: liked send the date format from here
    //  get fechaMaxima(){
    //      return this.fechaproceso.toLocaleString('es-es', {  year:"numeric", month:"long", day:"numeric"});
    //  }
}
