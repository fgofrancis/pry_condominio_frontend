import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Parametro} from '../models/parametro.model'
import { Observable, Subject } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  private parametro$: Subject<Parametro[]> = new Subject();

  constructor( private http:HttpClient ) { }

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
 

  cargarParametros(){
    //http://localhost:3000/api/parametros
    const url = `${base_url}/parametros`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, parametros:Parametro[] }) => resp.parametros)
                )
  }

  crearParametro(parametro:Parametro){
    //http://localhost:3000/api/parametros
    const url = `${base_url}/parametros`;
    console.log('url..: ', url)
    return this.http.post( url, parametro, this.headers );
  }

  obtenerParametroByID(_id:string){
    // http://localhost:3000/api/parametros/620108b4debd9e9ed29aec54
    const url =`${base_url}/parametros/${_id}`;
     return this.http.get<any>(url,this.headers )
                .pipe(
                  map( (resp: {ok:boolean, parametro:Parametro }) => resp.parametro)
                )
  }

  actualizarParametro(parametro:Parametro){
    //http://localhost:3000/api/parametros/61e050f884eb7bd8ad11d585
    const url = `${base_url}/parametros/${parametro._id}`;
    return this.http.put( url, parametro, this.headers );

  }


  borrarParametro(_id:string){
    //http://localhost:3000/api/parametros/xsdfadafd
    const url = `${base_url}/parametros/${_id}`;
    return this.http.delete( url, this.headers );
  }

}
