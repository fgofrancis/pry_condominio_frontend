import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Asignacion } from '../models/asignacion.model';

const base_url = environment.base_url;
 
@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  constructor(private http:HttpClient) { }

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
  
  cargarAsignaciones(){
    //http://localhost:3000/api/asignaciones
    const url = `${base_url}/asignaciones`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, asignaciones:Asignacion[] }) => resp.asignaciones)
                )
  }

  obtenerAsignacionesByID(_id:string){
    // http://localhost:3000/api/asignaciones/6211668f57175fb8ab3e46fb
    const url =`${base_url}/asignaciones/${_id}`;
    return this.http.get<any>(url,this.headers )
                .pipe(
                  map( (resp: {ok:boolean, asignacion:Asignacion }) => resp.asignacion)
                )
  }

  crearAsignacion(asignacion:Asignacion){
  
    //http://localhost:3000/api/asignaciones
    const url = `${base_url}/asignaciones`;
    return this.http.post( url, asignacion, this.headers );
  }

  actualizarAsignacion(asignacion:Asignacion){
    //http://localhost:3000/api/asignaciones/61e050f884eb7bd8ad11d585
    const url = `${base_url}/asignaciones/${asignacion._id}`;
    return this.http.put( url, asignacion, this.headers );
  }

  borrarAsignacion(_id:string){
    // http://localhost:3000/api/asignaciones/6211668f57175fb8ab3e46fb
    const url =`${base_url}/asignaciones/${_id}`;
    return this.http.delete(url,this.headers )
  }
}
