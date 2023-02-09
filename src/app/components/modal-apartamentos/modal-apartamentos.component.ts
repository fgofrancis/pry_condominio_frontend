import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apartamento } from 'src/app/models/apartamento.model';
import { ModalApartamentoService } from 'src/app/services/modal-apartamento.service';

@Component({
  selector: 'app-modal-apartamentos',
  templateUrl: './modal-apartamentos.component.html',
  styles: [
  ]
})
export class ModalApartamentosComponent implements OnInit {

  public apartamentos:Apartamento[]=[];
  public propietario: string = '';

  constructor( public _modalAptoService:ModalApartamentoService,
               public _activateRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this._modalAptoService.modal$.subscribe(apartamentos=>{
      this.apartamentos = apartamentos;
      this.propietario = apartamentos[0].idpropietario.nombre
    })
  }

  cerrarModal(){
    this._modalAptoService.cerrarModal();
  }
}
