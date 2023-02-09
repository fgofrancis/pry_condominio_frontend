import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!:FormGroup;
  public usuario:Usuario;
  public imagenSubir!:File;
  public imgTemp: any;

  constructor(private fb:FormBuilder,
              private _usuarioService:UsuarioService,
              private _fileUploadService:FileUploadService) { 
  
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      name: [this.usuario.nombre, Validators.required],
      email: [this.usuario.correo, [Validators.required, Validators.email]],
    })
  }

  actualizarPerfil(){
    this._usuarioService.actualizarPerfil(this.perfilForm.value)
          .subscribe(() =>{
            const { name, email } = this.perfilForm.value;
            this.usuario.nombre = name;
            this.usuario.correo = email;

            Swal.fire('Guardado','Los cambios fueron guardados','success');
          }, (err)=>{
              Swal.fire('Error',err.error.msg,'error');
            
          })
  }

  cambiarImagen( event:any ){
    this.imagenSubir = event.target.files[0];
    
    if ( !this.imagenSubir){
       return this.imgTemp = null; 
    }

    const reader = new FileReader();
    reader.readAsDataURL( this.imagenSubir);

    reader.onloadend = ()=>{
      this.imgTemp = reader.result;
    }
    return true;

  }

  subirImagen(){

    this._fileUploadService
      .actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid!)
      .then( img =>{
        this.usuario.img = img;

        Swal.fire('Imagen Cargada','Imagen Actualizada', 'success');
      }).catch( err =>{
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
  
      })
  }
}
