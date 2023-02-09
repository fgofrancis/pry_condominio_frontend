import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propietario } from 'src/app/models/propietario.model';
import { PropietariosService } from 'src/app/services/propietarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-propietario',
  templateUrl: './propietario.component.html',

})
export class PropietarioComponent implements OnInit {

  public propietarioForm!:FormGroup;
  public propietarioSeleccionado?: Propietario;

  constructor(private fb:FormBuilder,
              private _propietarioService:PropietariosService,
              private _router:Router,
              private _activeRoute:ActivatedRoute) { }


  ngOnInit(): void {

    this._activeRoute.params.subscribe(({id})=>{
      this.cargarPropietario(id);

    })

    this.propietarioForm = this.fb.group({
      identificacion:['',Validators.required],
      nombre:['',Validators.required],
      casa:[''],
      trabajo:[''],
      celular:[''],
      direccion:['']
     });
  }

  guardarPropietario(){

    //Tomando los datos del Formulario
    const { identificacion, nombre, casa,
            celular, trabajo, direccion 
          } = this.propietarioForm.value;
     
    //formando la data como la recibe la API
    const data = {
      ...this.propietarioForm.value,
      telefonos:{casa:casa, celular:celular, trabajo:trabajo }
      };

    if(this.propietarioSeleccionado){
      //Actualizar
      const data = {
        ...this.propietarioForm.value,
        telefonos:{casa:casa, celular:celular, trabajo:trabajo },
        _id: this.propietarioSeleccionado._id
        };


      this._propietarioService.actualizarPropietarioById(data).subscribe(resp =>{
        Swal.fire('Actualizando',`Propietario ${ nombre } Actualizado correctamente`, 'success');
        this._router.navigateByUrl('/nomina/propietarios');
      })
    }else{
      //Crear
      // const data = this.propietarioForm.value;
      // console.log('propietario..: ', data);

      this._propietarioService.crearPropietario(data).subscribe(resp=>{
  
        Swal.fire('Registro','Propietario gravado exitosamente','success');
        this._router.navigateByUrl('/nomina/propietarios');
      })
    }
    
  };

  cargarPropietario(id:string){

    if (id === 'nuevo'){
      return;
    }

    this._propietarioService.buscarPropietarioById(id).subscribe(propietario =>{

       const { identificacion,
               nombre,
               telefonos:{casa:casa, celular:celular, trabajo:trabajo },
               direccion
             } = propietario;

       this.propietarioSeleccionado = propietario;

       this.propietarioForm.setValue({identificacion, nombre, casa, 
                                      celular,trabajo, direccion });
       return;
    })

  }


}
