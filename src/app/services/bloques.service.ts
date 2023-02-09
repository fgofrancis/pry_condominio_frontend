import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bloque } from '../models/bloque.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BloquesService {

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
  cargarBloques(){
    const url = `${base_url}/bloques`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, bloques:Bloque[] }) => resp.bloques)
                )
  }

  crearBloque(bloque: Bloque){
    const url = `${base_url}/bloques`;
    return this.http.post( url, bloque, this.headers);

  };

  buscarBloqueById(id:string){
    const url = `${base_url}/bloques/${id}`;
    return this.http.get<any>(url, this.headers )
                .pipe(
                  map( (resp:{ok:boolean, bloque:Bloque} )=> resp.bloque)
                )
  }

  actualizarBloqueById(bloque:Bloque){
    const url = `${base_url}/bloques/${bloque._id}`;
    return this.http.put(url,bloque, this.headers )
  };

  eliminarBloqueById(id:string){
    const url = `${base_url}/bloques/${id}`;
    return this.http.delete(url, this.headers )
  }
}
