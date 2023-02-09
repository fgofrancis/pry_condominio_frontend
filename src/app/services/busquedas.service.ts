import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Compania } from '../models/compania.model';
import { Usuario } from '../models/usuario.model';
import { Empleado } from '../models/empleado.model';

import { environment } from 'src/environments/environment';

import { Bloque } from '../models/bloque.model';
import { Propietario } from '../models/propietario.model';
import { Apartamento } from '../models/apartamento.model';
import { Cuota } from '../models/cuota.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  };

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  };

  private transformarUsuarios( resultados: any[]):Usuario[]{

    return resultados.map(
      // user => new Usuario(user.name, user.email, '',user.img,user.google,user.role,user.uid)
      user => new Usuario(user.nombre, user.correo, '',user.estado, user.role,user.img,user.google,user.uid)
    );
  }

  private transformarCompanias( resultados: any[]):Compania[]{

    return resultados;
  }
  private transformarEmpleados( resultados: any[]):Empleado[]{

    return resultados;
  }
  private transformarBloques( resultados: any[]):Bloque[]{
    
    return resultados;
  }

  private transformarPropietarios( resultados: any[]):Propietario[]{
     return resultados;
  }

  private transformarApartamentos( resultados: any[]):Apartamento[]{
     return resultados;
  }
  private transformarCuotas( resultados: any[]):Cuota[]{
     return resultados;
  }

  buscar(tipo: 'escalas'|'usuarios'|'empleados'|'companias'|'bloques'|'propietarios'|
               'apartamentos'| 'cuotas', termino:string )
   {

    const url = `${base_url}/buscar/${tipo}/${termino}`;
    // const url = `${base_url}/buscar/${tipo}/${termino}`;
    return this.http.get<any[]>( url, this.headers )
        .pipe(
          map( (resp:any) => {
            switch ( tipo) {
              case 'usuarios':
                return this.transformarUsuarios(resp.resultados);

              case 'empleados':
                return this.transformarEmpleados(resp.resultados);

              case 'companias':
                return this.transformarCompanias(resp.resultados);
              
              case 'bloques':
                return this.transformarBloques(resp.bloque);

              case 'propietarios':
                return this.transformarPropietarios(resp.propietario);
             
              case 'apartamentos':
              return this.transformarApartamentos(resp.apartamento);

              case 'cuotas':
              return this.transformarCuotas(resp.cuota);
            
              default:
                return [];
            }
          })
        )

  }

}
