import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bloque } from 'src/app/models/bloque.model';
import { BloquesService } from 'src/app/services/bloques.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bloque',
  templateUrl: './bloque.component.html',

})
export class BloqueComponent implements OnInit {

  public bloqueForm!:FormGroup;
  public bloqueSeleccionado?: Bloque;

  constructor(private fb:FormBuilder,
              private _bloqueSevice:BloquesService,
              private _router:Router,
              private _activeRoute:ActivatedRoute) { }


  ngOnInit(): void {

    this._activeRoute.params.subscribe(({id})=>{
      this.cargarBloque(id);

    })

    this.bloqueForm = this.fb.group({
      codigo:['',Validators.required],
      tipo:['',Validators.required],
      ubicacion:['',Validators.required],
      cuota:['0.00',Validators.required],
     });
  }

  guardarBloque(){

    const {codigo } = this.bloqueForm.value;
 
    if(this.bloqueSeleccionado){
      //Actualizar
      const data = {
        ...this.bloqueForm.value,
        _id: this.bloqueSeleccionado._id
      }

      this._bloqueSevice.actualizarBloqueById(data).subscribe(resp =>{
        Swal.fire('Actualizando',`Bloque ${ codigo } Actualizado correctamente`, 'success');
        this._router.navigateByUrl('/nomina/bloques');
      })
    }else{
      //Crear
      const data = this.bloqueForm.value;
      this._bloqueSevice.crearBloque(data).subscribe(resp=>{
  
        Swal.fire('Registro','Bloque gravado exitosamente','success');
        this._router.navigateByUrl('/nomina/bloques');
      })
    }
    
  };

  cargarBloque(id:string){

    if (id === 'nuevo'){
      return;
    }

    this._bloqueSevice.buscarBloqueById(id).subscribe(bloque =>{

       const { codigo, tipo, ubicacion, cuota } = bloque;
       this.bloqueSeleccionado = bloque;

       this.bloqueForm.setValue({codigo, tipo, ubicacion, cuota });
       return;
    })

  }

}
