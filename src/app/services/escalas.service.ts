import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { Renglon} from '../models/renglon.model'
import { EscalaSalarial } from '../models/escalaSalaria-model';

const base_url = environment.base_url;

 
@Injectable({
  providedIn: 'root'
})
export class EscalaService {

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

  cargarEscala(){
    //http://localhost:3000/api/escalas
    const url = `${base_url}/escalas`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, escalas:EscalaSalarial[] }) => resp.escalas)
                )
  }

  crearEscala(escala:EscalaSalarial){
    //http://localhost:3000/api/renglon
    const url = `${base_url}/escalas`;
    return this.http.post( url, escala, this.headers );
  }

  obtenerEscalaByID(_id:string){
    // http://localhost:3000/api/renglones/620108b4debd9e9ed29aec54
    const url =`${base_url}/escalas/${_id}`;
     return this.http.get<any>(url,this.headers )
                .pipe(
                  map( (resp: {ok:boolean, escala:EscalaSalarial }) => resp.escala)
                )
  }

  actualizarRenglon(escala:EscalaSalarial){
    //http://localhost:3000/api/renglones/61e050f884eb7bd8ad11d585
    const url = `${base_url}/escalas/${escala._id}`;
    return this.http.put( url, escala, this.headers );

  }

  borrarRenglon(_id:string){
    //http://localhost:3000/api/renglones/61e050f884eb7bd8ad11d585
    const url = `${base_url}/escalas/${_id}`;
    return this.http.delete( url, this.headers );
  }

}