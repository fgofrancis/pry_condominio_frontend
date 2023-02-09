import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { Compania } from 'src/app/models/compania.model';
import { CompaniaService } from 'src/app/services/compania.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  styles: [
  ]
})
export class CompaniaComponent implements OnInit, OnDestroy {
 
  public companias:Compania[] = [];
  public cargando:boolean = true;
  public imgSubs!:Subscription;


  constructor(private _companiaService:CompaniaService,
              private _modalImagenService:ModalImagenService,
              private _busquedaService:BusquedasService) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.cargandoCias()

    this.imgSubs = this._modalImagenService.nuevaImagen //aveces se necesita el delay
      .pipe(delay(100))
      .subscribe(img => this.cargandoCias());
    
  }

  buscar( termino:string){

    if (termino.length === 0){
      return this.cargandoCias();
    }

    this._busquedaService.buscar('companias', termino)
            .subscribe( (resultados:any) =>{
              this.companias = resultados;
            })
    return;  
  }
  
  cargandoCias(){
    this.cargando = true;
    this._companiaService.cargarCompanias()
          .subscribe( (companias)=>{
            this.cargando = false;
            this.companias = companias;
          })
  }

  guardarCambios(compania: Compania){
    this._companiaService.actualizarCompania(compania._id, compania)
        .subscribe( (resp:any) =>{
          Swal.fire( 'Actualizado',compania.name,'success' );
          // this.companias.push(resp);
        });
  }

  eliminarCia(compania:Compania){
    this._companiaService.borrarCompania(compania._id)
        .subscribe( resp =>{
          this.cargandoCias();
          Swal.fire( 'Eliminado',compania.name,'success' );
        });
  }

  abrirModal(compania:Compania){

    this._modalImagenService.abrirModal('companias',compania._id!,compania.img);
  }
  
}
