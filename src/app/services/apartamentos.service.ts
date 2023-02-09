import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarApartamento } from '../interfaces/cargar-apartamento';
import { CrearApartamento } from '../interfaces/crear-apartamento';
import { Apartamento } from '../models/apartamento.model';

/*
'http://localhost:9090/api'
*/
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ApartamentosService {

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
  cargarApartamentos(desde:number = 0, limite:number = 0 ){
    const url = `${base_url}/apartamentos?desde=${desde}&limite=${limite}`;
    return this.http.get<CargarApartamento>( url, this.headers )
  }

  crearApartamento(apartameno: Apartamento){
    const url = `${base_url}/apartamentos`;
    return this.http.post<CrearApartamento>( url, apartameno, this.headers);
  };

  buscarApartamentoById(id:string){
    const url = `${base_url}/apartamentos/${id}`;
    return this.http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, apartamento:Apartamento} )=> resp.apartamento)
                )
  }

  actualizarApartamentoById(apartamento:Apartamento){
    const url = `${base_url}/apartamentos/${apartamento._id}`;
    return this.http.put(url,apartamento, this.headers )
  };

  eliminarApartamentoById(id:string){
    const url = `${base_url}/apartamentos/${id}`;
    return this.http.delete(url, this.headers )
  }

  buscarApartamentoByIdPropietario(idPropietario:string){
    const url = `${base_url}/apartamentos/propietario/${idPropietario}`;
    return this.http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, apartamentos:Apartamento[]} )=> resp.apartamentos)
                )
  }
}
