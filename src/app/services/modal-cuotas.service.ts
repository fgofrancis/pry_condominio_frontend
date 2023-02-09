import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalCuotasService {

  public modal$ = new EventEmitter<any>();//para emitir alguna información desde cualquier parte
  private _ocultarModal:boolean = true;

  get ocultarModal(){
    return this._ocultarModal;
  }
   
  abrirModal(){
    this._ocultarModal = false;
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
