import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Asignacion } from 'src/app/models/asignacion.model';
import { Empleado } from 'src/app/models/empleado.model';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styles: [
  ]
})
export class AsignacionComponent implements OnInit {

  public formAsignacion!:FormGroup;
  public empleados:Empleado[]= [];
  public empleadoSeleccionado?:Empleado;
  public asignacionSeleccionada?:Asignacion;
  public nombreCompleto?:string = '';
  public salarioMensual:number = 0;

  public salarioCotizableTSS:number  = 0; 
  public otrasRemuneraciones:number  = 0; 
  public ingresosExentoISR:number    = 0;
  public totalRenglones:number       = 0;
  public salarioCotizableTSS1:number = 0; 
  public salarioCotizableISR:number = 0; 

  public NoverEmpleado:boolean = false;

  constructor(private fb:FormBuilder,
              private _asignacionSevice:AsignacionService,
              private _empleadoService:EmpleadoService,
              private _router:Router,
              private _activatedRoute:ActivatedRoute) { }
 
  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({id}) => this.cargarAsignacion(id));
 
    this.formAsignacion = this.fb.group({
      empleado:['',Validators.required],
      salario:['',Validators.required],
      comisiones:[''],
      vacaciones:[''],
      horasExtraDiasFeriados:[''],
      otrosIngresos:[''],
      bonosTrimestrales:[''],
      regaliaPascual:[''],
      indemnizacionesLaborales:[''],
      preavisoYCesantia:[''],
      reembolsos:[''],
      fechaRegistro:[''] 
    })
    //Para llenar el comboBox de empleado
    this.cargarEmpleado();

    this.formAsignacion.get('empleado')?.valueChanges
        .subscribe(empleadoID=>{

          this.empleadoSeleccionado = this.empleados.find(e =>e._id === empleadoID);

          const {name1,name2, apell1, apell2, salario }= this.empleadoSeleccionado!
          this.nombreCompleto = this._empleadoService.nombreCompleto(name1,name2, apell1, apell2);
         
          // this.formAsignacion.controls['salario'].setValue(salario);
          this.formAsignacion.get('salario')?.setValue(salario / 2 )
          this.salarioMensual = salario

        })
  }
 
  crearAsignacion(){
    // tomando los valores del formulario
    const { 
      salario,comisiones,vacaciones,
      horasExtraDiasFeriados, otrosIngresos,bonosTrimestrales,
      regaliaPascual, indemnizacionesLaborales,preavisoYCesantia,
      reembolsos
    } = this.formAsignacion.value

    //formando la data como la recibe la API
    const data = {
       ...this.formAsignacion.value,
       salarioCotizableTSS: {salario:salario, comisiones: comisiones, vacaciones:vacaciones },
       otrasRemuneraciones: {horasExtraDiasFeriados, otrosIngresos, bonosTrimestrales},
       ingresosExentoISR:   {regaliaPascual, indemnizacionesLaborales, preavisoYCesantia} 
    }

    //Totales:
    this.salarioCotizableTSS = salario + comisiones + vacaciones; 
    this.otrasRemuneraciones = horasExtraDiasFeriados + otrosIngresos + bonosTrimestrales; 
    this.ingresosExentoISR   = regaliaPascual + indemnizacionesLaborales + preavisoYCesantia
    
    this.totalRenglones = this.salarioCotizableTSS + this.otrasRemuneraciones
                         + this.ingresosExentoISR  + reembolsos;

    // Calculo para la TSS y ISR
    this.salarioCotizableTSS1 = (salario) * 2 + comisiones + vacaciones;
    

    if (this.asignacionSeleccionada){
      //Actualiza
      const data = {
         ...this.formAsignacion.value,
         salarioCotizableTSS: {salario:salario, comisiones: comisiones, vacaciones:vacaciones },
         otrasRemuneraciones: {horasExtraDiasFeriados, otrosIngresos, bonosTrimestrales},
         ingresosExentoISR:   {regaliaPascual, indemnizacionesLaborales, preavisoYCesantia},
         _id:this.asignacionSeleccionada._id
      }
      
      this._asignacionSevice.actualizarAsignacion(data)
          .subscribe(resp=>{
            Swal.fire( 'Actualizado', 'Asignación actualizada correctamente','success' );
          })  

    }else{
      //Crear
      this._asignacionSevice.crearAsignacion(data)
          .subscribe(resp=>{
  
            Swal.fire( 'Registrado', 'asignación registrada correctamente','success' );
            this._router.navigateByUrl(`/nomina/asignaciones`);
  
          })
    }
   }


  cargarEmpleado(){
    this._empleadoService.cargarEmpleados()
        .subscribe(empleados=>{
          this.empleados = empleados;
        })
  }

  cargarAsignacion(id:string){

    if ( id === 'nuevo' ) {
      return;
    }
    this.NoverEmpleado = true;
    
    this._asignacionSevice.obtenerAsignacionesByID(id)
        .pipe(
          delay(100)
        )
        .subscribe(asignacion=>{

          const { empleado:{_id},
                  salarioCotizableTSS: {salario:salario, comisiones: comisiones, vacaciones:vacaciones },
                  otrasRemuneraciones: {horasExtraDiasFeriados, otrosIngresos, bonosTrimestrales},
                  ingresosExentoISR:   {regaliaPascual, indemnizacionesLaborales, preavisoYCesantia}, 
                  reembolsos ,fechaRegistro
                } = asignacion;

          this.formAsignacion.setValue({
                empleado:_id, salario, comisiones, vacaciones ,
                horasExtraDiasFeriados, otrosIngresos, bonosTrimestrales,
                regaliaPascual, indemnizacionesLaborales, preavisoYCesantia, 
                reembolsos,fechaRegistro
          });

          this.asignacionSeleccionada = asignacion;

          //Totales:
          this.salarioCotizableTSS = salario + comisiones! + vacaciones!; 
          this.otrasRemuneraciones = horasExtraDiasFeriados! + otrosIngresos! + bonosTrimestrales!; 
          this.ingresosExentoISR   = regaliaPascual! + indemnizacionesLaborales! + preavisoYCesantia!
          
          this.totalRenglones = this.salarioCotizableTSS + this.otrasRemuneraciones + this.ingresosExentoISR 
                                + reembolsos;


        })
  }
}
