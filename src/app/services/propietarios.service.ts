import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarPropietario } from '../interfaces/cargar-propietario';
import { Propietario } from '../models/propietario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PropietariosService {

  constructor( private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token,
        responseType: 'json'
      }
    }
  }

  //Busqueda paginada
  cargarPropietarios(desde:number = 0, limite:number = 0 ){
    const url = `${base_url}/propietarios?desde=${desde}&limite=${limite}`;
    return this.http.get<CargarPropietario>( url, this.headers )
    
  }

  crearPropietario(propietario: Propietario){
    const url = `${base_url}/propietarios`;
    return this.http.post( url, propietario, this.headers);

  };

  buscarPropietarioById(id:string){
    const url = `${base_url}/propietarios/${id}`;
    return this.http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, propietario:Propietario} )=> resp.propietario)
                )
  }

  actualizarPropietarioById(propietario:Propietario){
    const url = `${base_url}/propietarios/${propietario._id}`;
    return this.http.put(url,propietario, this.headers )
  };

  eliminarPropietarioById(id:string){
    const url = `${base_url}/propietarios/${id}`;
    return this.http.delete(url, this.headers )
  }
}
