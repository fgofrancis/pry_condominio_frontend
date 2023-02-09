import { Component, OnInit } from '@angular/core';
import { DeduccionWork } from 'src/app/models/deduccion-work';
import { Deduccion } from 'src/app/models/deduccion.model';
import { DeduccionService } from 'src/app/services/deduccion.service';
import { RetencionLeyService } from 'src/app/services/retencionLey.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deducciones',
  templateUrl: './deducciones.component.html',
  styles: [
  ]
})
export class DeduccionesComponent implements OnInit {

  public deducciones:Deduccion[] = [];
  public deducWork: DeduccionWork[] =[]; 

  constructor(private _deduccionService:DeduccionService,
              private _retencionLeyService:RetencionLeyService) { }

  ngOnInit(): void {
    this.cargarDeducciones();
  }

  cargarDeducciones(){
    this._deduccionService.cargarDeducciones()
        .subscribe(deducciones=>{
          // console.log(deducciones);
          this.deducciones = deducciones

          const deducWork = deducciones.map((arrayWork)=>{
              const _id = arrayWork._id;
              const nombre = arrayWork.empleado.name1;

              // console.log('afp...: ', arrayWork.retencionesLey.sfs)
              const retencionesLey    = arrayWork.retencionesLey.afp +
                                      arrayWork.retencionesLey.sfs +
                                      arrayWork.retencionesLey.retISR! +
                                      arrayWork.retencionesLey.adicTSS! ;

              const otrasDeducciones = arrayWork.otrasDeducciones.cxcEmpleado! +
                                     arrayWork.otrasDeducciones.otrosDescuentos!;

              const totalDeducciones = retencionesLey + otrasDeducciones

              const data ={
                _id:_id,
                nombre: nombre,
                retencionesLey:retencionesLey,
                otrasDeducciones:otrasDeducciones,
                totalDeducciones:totalDeducciones 
              }
              return data;
          })
          this.deducWork = deducWork
        })
  }

  crearDeduccion(){}
  
  eliminarDeduccion(id:string){
    this._deduccionService.borrarDeduccion(id)
        .subscribe(resp=>{
          this.cargarDeducciones();
          Swal.fire( 'Eliminado',`Deducción Eliminada Exitosamente`,'success' );
        })
  }

  calcISR(num:number){
    console.log('ISR.. comp: ', this._retencionLeyService.calcISR(num));
   }
} 
