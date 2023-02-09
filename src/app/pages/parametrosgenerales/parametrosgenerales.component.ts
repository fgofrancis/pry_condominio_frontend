import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Parametro } from 'src/app/models/parametro.model';

import { ParametroService } from 'src/app/services/parametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametrosgenerales',
  templateUrl: './parametrosgenerales.component.html',
  styles: [
  ]
})
export class ParametrosgeneralesComponent implements OnInit {

  public parametros:Parametro[] = [];
  parametro$: Observable<Parametro[]> = new Observable();

  constructor( private _parametroService: ParametroService) { }

  ngOnInit(): void {
     this.cargarParametro();
  }
 
  cargarParametro(){
    this._parametroService.cargarParametros()
        .subscribe(resp =>{
          this.parametros = resp;
        })
  }

  borrarParametro(parametro:Parametro){
    this._parametroService.borrarParametro(parametro._id)
        .subscribe( resp=>{
          this.cargarParametro();
        Swal.fire('Eliminado',`Parámetro eliminado exitosamente`,'success' )
        })
  }

}
