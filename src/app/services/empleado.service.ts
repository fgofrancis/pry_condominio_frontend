
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Empleado} from '../models/empleado.model'

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

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

  cargarEmpleados(){
    //http://localhost:3000/api/cias
    const url = `${base_url}/empleados`;
    return this.http.get<any>( url, this.headers )
                .pipe(
                  map( (resp: {ok:boolean, empleado:Empleado[] }) => resp.empleado)
                )
  }

  obtenerEmpleadoByID(_id:string){
    // http://localhost:3000/api/empleados/620108b4debd9e9ed29aec54
    const url =`${base_url}/empleados/${_id}`;
    return this.http.get<any>(url,this.headers )
                .pipe(
                  map( (resp: {ok:boolean, empleado:Empleado }) => resp.empleado)
                )
  }

  crearEmpleado(empleado:Empleado){
    //http://localhost:3000/api/cias
    const url = `${base_url}/empleados`;
    return this.http.post( url, empleado, this.headers );
  }

  actualizarEmpleado(empleado:Empleado){
    //http://localhost:3000/api/cias/61e050f884eb7bd8ad11d585
    const url = `${base_url}/empleados/${empleado._id}`;
    return this.http.put( url, empleado, this.headers );
  }
 
  borrarEmpleado(_id:string){
    //http://localhost:3000/api/cias/61e050f884eb7bd8ad11d585
    const url = `${base_url}/empleados/${_id}`;
    return this.http.delete( url, this.headers );
  }

  nombreCompleto(name1:string,name2:string, apell1:string, apell2:string){
    let nombres, apellidos, nombreCompleto = '';
    if(name2!== null) {
        nombres = name1 +' '+ name2
    }else{
      nombres = name1
    }

    if(apell2 !== null) {
        apellidos = apell1 + ' ' + apell2 
    }else{
      apellidos = apell1
    }

    return nombreCompleto =`${nombres} ${apellidos}`// nombres + apellidos
    
  }
}
