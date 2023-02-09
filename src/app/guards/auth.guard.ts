import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
 
  constructor( private _usuarioService:UsuarioService,
               private _router: Router){}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('Auth-debugger.. canLoad ')
    return this._usuarioService.validarToken()
        .pipe(
          tap(isAutenticado => {
            if (!isAutenticado){
              this._router.navigateByUrl('/auth/login');
            }
          })
        ) 
  }
   
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
 
      console.log('Auth-debugger.. canActivate ')
      // La peticion se subcribe y el mismo maneja el unsubcribe y todo
    return this._usuarioService.validarToken()
            .pipe(
              tap( estaAutenticado =>{

                if( !estaAutenticado) {
                    this._router.navigateByUrl('auth/login');
                }
              })
            )
  }
  
}
