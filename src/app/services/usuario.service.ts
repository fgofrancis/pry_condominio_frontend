import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap,map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form';
import { Usuario }  from '../models/usuario.model';
import { ICargarUsuarios } from '../interfaces/cargar-usuarios';
import { Compania } from '../models/compania.model';

const base_url = environment.base_url;
declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario!:Usuario;

  constructor(private http:HttpClient,
              private _router:Router,
              private _ngZone:NgZone) {
    
    this.googleIni();
  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE'| 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleIni(){

    return new Promise<void>(resolve =>{
  
      gapi.load('auth2', ()=> {
        this.auth2 = gapi.auth2.init({
          // client_id: '702149577437-543h8cnmsq1ctrn9ldpkh9kogftg2t6h.apps.googleusercontent.com',
          client_id: '810013240590-m0hbphchbo2h63v1am9ms3r9s260poto.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });

    })
  }

  logout(){
    
    localStorage.removeItem('token');
   
    this.auth2.signOut().then( ()=> {

      this._ngZone.run( ()=>{
        this._router.navigateByUrl('/auth/login');
      })
    });

  }

  validarToken():Observable<boolean>{

    return this.http.get(`${base_url}/auth/renew/token`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      tap( (resp:any) =>{
        const { nombre, correo, password,estado,role,img ='', google, uid } = resp.usuarioDB
        this.usuario = new Usuario(nombre,correo,password,estado,role,img,google,uid);

        localStorage.setItem('token',resp.token)
    
      }),
      map(resp => true),
      catchError( error=> {
        console.log('Error...: ', error)
        return of(false)} )  
    );


  }

  crearUsuario( formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(
      tap( (resp:any) =>{
        localStorage.setItem('token',resp.token)
      })
    )
  }

  actualizarPerfil( data:{name:string, email:string, role:string} ){
  // actualizarPerfil( data:{name:string, email:string, role:string, companiaID:Compania} ){

    data = {
      ...data,
      role: this.usuario.role!,
      // companiaID: this.usuario.companiaID!
    };
    // http://localhost:3000/api/usuarios/61cb871217e594cb891cb502 met= put, body
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm){

    return this.http.post(`${base_url}/auth/login`, formData)
              .pipe(
                  tap( (resp:any )=>{
                    localStorage.setItem('token',resp.token)
                  })
                )
  }

  loginGoogle(token:any){
    
    return this.http.post(`${base_url}/auth/login/google`, {token})
                .pipe(
                  tap( (resp:any )=>{
                    localStorage.setItem('token',resp.token)
                  })
                )
  }
 
  cargarUsuarios(desde: number=0){

    // http://localhost:3000/api/usuarios?desde=5
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<ICargarUsuarios>( url, this.headers )
            .pipe(
              delay(500),
              map( resp =>{
                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.nombre, user.correo, '',user.estado, user.role,user.img,user.google,user.uid)
                  // user => new Usuario(user.companiaID,user.name, user.email, '',user.img,user.google,user.role,user.uid)
                );

                return {
                  total: resp.total,
                  usuarios
                };
              })
            )
  }
 
  eliminarUsuario(usuario:Usuario){
    //http://localhost:3000/api/usuarios/61ca5a060969833706007c72
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete( url, this.headers );
 }

 guardarUsuario( usuario:Usuario ){

  // http://localhost:3000/api/usuarios/61cb871217e594cb891cb502 met= put, body, headers
  return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
}

}