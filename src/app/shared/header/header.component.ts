import { Component, OnInit } from '@angular/core';
import { Compania } from 'src/app/models/compania.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CompaniaService } from 'src/app/services/compania.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public usuario!: Usuario;
  public compania?:Compania;
  public nombreCia:string = '';

  constructor( private _ususuarioService:UsuarioService,
               private _companiaService: CompaniaService) {}
  

  ngOnInit(): void {

    this.usuario = this._ususuarioService.usuario;
    // TODO agragar la cia mas luego
    // this._companiaService.cargarCompanias()
    //     .subscribe( (resp:any) =>{
    //       this.compania = resp.find((h:any) =>h._id === this.usuario.companiaID ); 
    //       this.nombreCia = this.compania!.name;
            
    //     })
  }

  logout(){

    this._ususuarioService.logout();
  }



}
