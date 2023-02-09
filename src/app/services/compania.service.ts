import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Compania} from '../models/compania.model'

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CompaniaService {

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

  cargarCompanias(){
    //http://localhost:3000/api/cias
    const url = `${base_url}/cias`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, companias:Compania[] }) => resp.companias)
                )
        
  }
  crearCompania(compania:Compania){
    //http://localhost:3000/api/cias
    const url = `${base_url}/cias`;
    return this.http.post( url, compania, this.headers );
  }

  actualizarCompania(_id:string, compania:Compania){
    //http://localhost:3000/api/cias/61e050f884eb7bd8ad11d585
    const url = `${base_url}/cias/${_id}`;
    return this.http.put( url, compania, this.headers );
  }

  borrarCompania(_id:string){
    //http://localhost:3000/api/cias/61e050f884eb7bd8ad11d585
    const url = `${base_url}/cias/${_id}`;
    return this.http.delete( url, this.headers );
  }

}
