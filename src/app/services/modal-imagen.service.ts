import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo!:'usuarios'|'empleados'|'companias';
  public id?:string;
  public img?:string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo:'companias'|'usuarios'|'empleados',
    id:string,
    img:string = 'no-img' 
  ){
    this._ocultarModal = false;
    this.tipo=tipo;
    this.id=id;
    // http://localhost:3000/api/uploads/companias/no-image.png
    if( img.includes('https') ){
      this.img = img;
    }else{
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
 
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
