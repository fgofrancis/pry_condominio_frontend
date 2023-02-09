import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Formapago} from '../models/formapago.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

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
 
  pagoCuota(data:{idapartamento:string, monto:number, fecha:string,
                  idformapago:string, comentario:string}){

    return this._http.post(`${base_url}/pagos/pago`,data, );
  };

  buscarReciboByIdApartamento(idapartamento:string, fechapago:Date){
    return this._http.get(`${base_url}/pagos/recibos/apto/${idapartamento}/${fechapago}`)
  };

  buscarDetalleReciboByIdPago(idpago:string){
    return this._http.get(`${base_url}/pagos/recibos/detalles/${idpago}`)
  };
  
  buscarFormapago(){
    return this._http.get<any>(`${base_url}/pagos/formapago`)
                      .pipe(
                        map( (resp:{ok:boolean, formapagoDB:Formapago[] }) =>resp.formapagoDB)
                      )
  };


}
