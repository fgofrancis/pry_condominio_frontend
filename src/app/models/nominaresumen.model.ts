export class NominaResumen{
    
    constructor(

       public identificacion:string,
       public nombre:string,
       public asignacion:number,
       public deduccion:number,
       public netoapagar:number,
       public fechaRegistro:Date,
       public IdProcess: string
    ){}
}