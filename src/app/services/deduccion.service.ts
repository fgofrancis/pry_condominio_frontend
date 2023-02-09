import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Asignacion } from '../models/asignacion.model';
import { Deduccion } from '../models/deduccion.model';
import { Empleado } from '../models/empleado.model';
import { AsignacionService } from './asignacion.service';
import { ParametroService } from './parametro.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
 
export class DeduccionService {
  
  constructor( private http:HttpClient, 
               private _asignacionService:AsignacionService,
               private _parametroService:ParametroService) { }

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

  cargarDeducciones(){
    //http://localhost:3000/api/deducciones
    const url = `${base_url}/deducciones`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, deducciones:Deduccion[] }) => resp.deducciones)
                )
  }
  
  obtenerDeduccionesByID(_id:string){
    // http://localhost:3000/api/asignaciones/6211668f57175fb8ab3e46fb
    const url =`${base_url}/deducciones/${_id}`;
    return this.http.get<any>(url,this.headers )
                .pipe(
                  map( (resp: {ok:boolean, deduccion:Deduccion }) => resp.deduccion)
                )
  }

  actualizarDeduccion(deduccion:Deduccion){
    //http://localhost:3000/api/asignaciones/61e050f884eb7bd8ad11d585
    const url = `${base_url}/deducciones/${deduccion._id}`;
    return this.http.put( url, deduccion, this.headers );
  }

  crearDeduccion(deduccion:Deduccion){
  
    //http://localhost:3000/api/deducciones
    const url = `${base_url}/deducciones`;
    return this.http.post( url, deduccion, this.headers );
  }

 
  borrarDeduccion(_id:string){
    // http://localhost:3000/api/deducciones/6211668f57175fb8ab3e46fb
    const url =`${base_url}/deducciones/${_id}`;
    return this.http.delete(url,this.headers )
  }

}
