import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AsignacionWork } from 'src/app/models/asignacion-work';
import { Asignacion } from 'src/app/models/asignacion.model';
import { AsignacionService } from 'src/app/services/asignacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styles: [
  ]
})
export class AsignacionesComponent implements OnInit {

  public asignaciones1!:Asignacion;
  public asignaciones:Asignacion[] = [];

  public asignWork1: AsignacionWork[] =[]; 

   constructor(private _asignacionService:AsignacionService) { }

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  cargarAsignaciones(){
    // const asignWork = new AsignacionWork('',0,0,0,0,0)
    this._asignacionService.cargarAsignaciones()
        .subscribe(resp=>{
          this.asignaciones = resp;
 
          const asignWork = resp.map( (arrayWork)=>{
            const _id = arrayWork._id;
            const nombre = arrayWork.empleado.name1
            const salarioCotizableTSS = arrayWork.salarioCotizableTSS.salario +
                                        arrayWork.salarioCotizableTSS.comisiones!+
                                        arrayWork.salarioCotizableTSS.vacaciones!

            const otrasRemuneraciones =  arrayWork.otrasRemuneraciones.bonosTrimestrales! +
                                         arrayWork.otrasRemuneraciones.horasExtraDiasFeriados! +
                                         arrayWork.otrasRemuneraciones.otrosIngresos!

            const ingresosExentoISR =    arrayWork.ingresosExentoISR.indemnizacionesLaborales! +
                                         arrayWork.ingresosExentoISR.preavisoYCesantia! +
                                         arrayWork.ingresosExentoISR.regaliaPascual!

            const otroReembolso =        arrayWork.reembolsos;

            
            const totalAsignacion = salarioCotizableTSS + otrasRemuneraciones +
                                    ingresosExentoISR   + otroReembolso 
            const data ={
              _id:_id, 
              nombre: nombre,
              salarioCotizableTSS:salarioCotizableTSS,
              otrasRemuneraciones: otrasRemuneraciones,
              ingresosExentoISR: ingresosExentoISR,
              otroReembolso: otroReembolso,
              totalAsignacion: totalAsignacion
            }
            return data;
          });
          this.asignWork1 = asignWork
        })
  }

  eliminarAsignacion(id:string){
    this._asignacionService.borrarAsignacion(id)
        .subscribe(resp=>{
          this.cargarAsignaciones();
          Swal.fire( 'Eliminado',`Asignacion Eliminada Exitosamente`,'success' );
        })
  }
}
