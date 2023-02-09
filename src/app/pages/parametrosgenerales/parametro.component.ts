import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Parametro } from 'src/app/models/parametro.model';
import { ParametroService } from 'src/app/services/parametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styles: [
  ]
})
export class ParametroComponent implements OnInit {

  public formParametro!:FormGroup;
  public parametros:Parametro[]= [];
  public parametroSeleccionado!: Parametro;

  constructor( private fb:FormBuilder,
               private _parametroService:ParametroService,
               private _router:Router,
               private _activatedRoute: ActivatedRoute)
   {}

  ngOnInit(): void {

    this._activatedRoute.params.subscribe(({id}) => this.cargarParametro(id));
 
    this.formParametro = this.fb.group({
      salarioMinPromedio: ['', Validators.required],
      SFStasaEmpleado:    ['', Validators.required],
      SFStasaPatron:      ['', Validators.required],
      SVDStasaEmpleado:   ['', Validators.required],
      SVDStasaPatron:     ['', Validators.required],
      seguroRiesgoLaboral:['', Validators.required],
      salarioMinTSS:      ['', Validators.required]
    })
  }

  cargarParametro(id:string){

    if ( id === 'nuevo' ) {
      return;
    }

    this._parametroService.obtenerParametroByID(id)
          .subscribe(parametro =>{

            const { 
               salarioMinPromedio,
               seguroFamiliarSalud:{tasaEmpleado:SFStasaEmpleado, tasaPatron:SFStasaPatron},
               seguroVejezDiscapSobrevivencia:{tasaEmpleado:SVDStasaEmpleado, tasaPatron:SVDStasaPatron},
               seguroRiesgoLaboral, 
               salarioMinTSS
              //  fechaRegistro             
            } = parametro;

            this.formParametro.setValue( { 
              salarioMinPromedio, SFStasaEmpleado, SFStasaPatron,
              SVDStasaEmpleado,SVDStasaPatron, seguroRiesgoLaboral,
              salarioMinTSS
              // fechaRegistro
            });
            this.parametroSeleccionado = parametro;
          })

  }
 
  crearParametro(){

    //Tomando la data del formulario
    const { salarioMinPromedio, SFStasaEmpleado, SFStasaPatron,
            SVDStasaEmpleado,SVDStasaPatron, seguroRiesgoLaboral,
            salarioMinTSS, 
            fechaRegistro
    } = this.formParametro.value;

    //Formateando la data como la recibe la API
    const data = {
      ...this.formParametro.value,
      salarioMinPromedio,
      seguroFamiliarSalud:{tasaEmpleado:SFStasaEmpleado, tasaPatron:SFStasaPatron},
      seguroVejezDiscapSobrevivencia:{tasaEmpleado:SVDStasaEmpleado, tasaPatron:SVDStasaPatron},
      seguroRiesgoLaboral, 
      salarioMinTSS,
      fechaRegistro
    }
 
    if (this.parametroSeleccionado){
      //Actualizar
      const data = {
        ...this.formParametro.value,
        _id: this.parametroSeleccionado._id
      }
      this._parametroService.actualizarParametro(data)
          .subscribe(resp =>{
            Swal.fire( 'Actualizado',`Parámetro actualizado exitosamente` ,'success' );
            this._router.navigateByUrl('/nomina/parametros');
          })

    }else{
      //crear
      console.log('Datos: ', this.formParametro.value)
      this._parametroService.crearParametro(data)
          .subscribe( resp=>{
            Swal.fire( 'Registrado',`Parametros creados exitosamente` ,'success' );
            this._router.navigateByUrl('/nomina/parametros');
          })
    }
  }
}
