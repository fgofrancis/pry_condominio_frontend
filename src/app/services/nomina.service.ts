import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { NominaResumen } from '../models/nominaresumen.model';
import { NominaDetalle } from '../models/nominaDetalle.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class NominaService {

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
 
  cargarNomina(){
    // http://localhost:3000/api/empdedasig
    const url = `${base_url}/empdedasig`;
    return this.http.get<any>( url, this.headers )

  };

  // .pipe(
  //   map( (resp: {ok:boolean, empleado:Empleado[] }) => resp.empleado)
  // )

  cargarNominaResumen(){
    const url = `${base_url}/nominaProcess`;
    return this.http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ ok:boolean, resul:NominaResumen[]})=> resp.resul)
                )
  }

  cargarNominaProcessID(IdProcess:string){
    // http://localhost:3000/api/nominaProcess/3be6d894-73cc-408e-9117-392ffed818c9
    const url = `${base_url}/nominaProcess/${IdProcess}`;
    return this.http.get<any>(url, this.headers)
  }
  cargarNominaProcessIDidEmpleado(IdProcess:string, idEmpleado:string){
    // http://localhost:3000/api/nominaProcess/3be6d894-73cc-408e-9117-392ffed818c9/402-3594100-8
    const url = `${base_url}/nominaProcess/${IdProcess}/${idEmpleado}`;
    return this.http.get<any>(url, this.headers)
                .pipe(
                  map( (resp:{ok:boolean,nomina:NominaDetalle})=>resp.nomina)
                )
  }
}
