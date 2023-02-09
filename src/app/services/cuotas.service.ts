import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cuota } from '../models/cuota.model';
import { Procesocuota } from '../models/procesocuota.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  constructor(private _http:HttpClient) { }

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

  generarCuotas(fechacuotas:Date){
    const url = `${base_url}/cuotas/generarcuotas/${fechacuotas}`;
    // return this._http.get(`${base_url}/cuotas/generarcuotas`);
    return this._http.get<any>( url, this.headers )
    .pipe(
      map( (resp: {ok:boolean, cuotas:Cuota[] }) => resp.cuotas)
    )
  };

  cargarCuotas(){
    const url = `${base_url}/cuotas`;
    return this._http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, cuotas:Cuota[] }) => resp.cuotas)
                )
  }
  
  buscarCuotaById(id:string){
    const url = `${base_url}/cuotas/${id}`;
    return this._http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, cuota:Cuota} )=> resp.cuota)
                )
  };

  buscarCuotaByIdApartamento(idApartamento:string){
    const url = `${base_url}/cuotas/apto/${idApartamento}`;
    return this._http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, cuotas:Cuota} )=> resp.cuotas)
                )
  };

  buscarProcesoCuotasMax(){
    const url = `${base_url}/cuotas/procesocuotamax`;
    return this._http.get<any>(url, this.headers )
                .pipe( //Denny, me veo obligado a usar un array a pesar de saber q devuelve un solo registro
                  map( (resp:{ok:boolean, procesocuotamax:Procesocuota[]} )=> resp.procesocuotamax)
                )
  }
};

