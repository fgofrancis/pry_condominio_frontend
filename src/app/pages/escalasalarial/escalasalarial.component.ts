import { Component, OnInit } from '@angular/core';
import { EscalaSalarial } from 'src/app/models/escalaSalaria-model';
// import { Renglon } from 'src/app/models/renglon.model';
import { EscalaService } from 'src/app/services/escalas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escalasalarial',
  templateUrl: './escalasalarial.component.html',
  styles: [
  ]
})
export class EscalasalarialComponent implements OnInit {

  public escalas:EscalaSalarial[] = [];

  constructor( private _escalaService: EscalaService) { }

  ngOnInit(): void {

    this.cargarEscala();
  }

  cargarEscala(){
    this._escalaService.cargarEscala()
        .subscribe(escala =>{
       this.escalas = escala;

    })
  }

  borrarRenglon(escala: EscalaSalarial){

    this._escalaService.borrarRenglon(escala._id)
        .subscribe(resp=>{
        this.cargarEscala();
        Swal.fire('Eliminado',`Escala : ${escala.year} - ${escala.renglon}`,'success' )
        })
  }


}

