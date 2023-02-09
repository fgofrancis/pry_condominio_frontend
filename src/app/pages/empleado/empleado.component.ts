import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { Empleado } from 'src/app/models/empleado.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styles: [] 
})

export class EmpleadoComponent implements OnInit, OnDestroy{

  public empleados:Empleado[]=[];
  public cargando:boolean = true;
  public imgSubs!:Subscription;

  constructor( private _busquedaService: BusquedasService,
               private _empleadoService: EmpleadoService,
               private _modalImagenService:ModalImagenService) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
 
  ngOnInit(): void {
    this.cargandoEmpleado();

    this.imgSubs = this._modalImagenService.nuevaImagen //aveces se necesita el delay
    .pipe(delay(100))
    .subscribe(img => this.cargandoEmpleado());
  }

  buscar( termino:string){

    if (termino.length === 0){
      return this.cargandoEmpleado();
    }

    this._busquedaService.buscar('empleados', termino)
            .subscribe( (resultados:any) =>{
              this.empleados = resultados;
            })
    return;  
  }

  cargandoEmpleado(){
    this.cargando = true;
    this._empleadoService.cargarEmpleados()
          .subscribe( empleados=>{
            this.cargando = false;
            this.empleados = empleados;
          })
  }
 
  eliminarEmpleado(empleado: Empleado){
    this._empleadoService.borrarEmpleado(empleado._id)
        .subscribe(resp=>{
           this.cargandoEmpleado();
          Swal.fire( 'Eliminado',`Empleado ${empleado.name1} ${empleado.apell1}`,'success' );
        })
  }


}
