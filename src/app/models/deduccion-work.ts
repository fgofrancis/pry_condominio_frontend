
export class DeduccionWork{
    constructor(
        public _id:string,
        public nombre:string,
        public retencionesLey: number,
        public otrasDeducciones:number, 
        public totalDeducciones: number
    ){}
}
