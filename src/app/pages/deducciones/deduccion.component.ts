import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { delay } from 'rxjs/operators';
import { Asignacion } from 'src/app/models/asignacion.model';
import { Deduccion } from 'src/app/models/deduccion.model';

import { Empleado } from 'src/app/models/empleado.model';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { DeduccionService } from 'src/app/services/deduccion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { RetencionLeyService } from 'src/app/services/retencionLey.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deduccion',
  templateUrl: './deduccion.component.html',
  styles: [
  ]
})
export class DeduccionComponent implements OnInit {

  public formDeduccion!:FormGroup;
  public empleados:Empleado[]= [];
  public empleadoSeleccionado!:Empleado;
  public deduccionSelecionada?:Deduccion

  public nombreCompleto?:string = '';
  public salarioMensual:number  = 0;

  public retencionLeyTotal:number    = 0; 
  public otrasDeducciones :number    = 0; 
  public ingresosExentoISR:number    = 0;
  public totalRenglones:number       = 0;
  public salarioCotizableTSS:number  = 0; 
  public salarioCotizableISR:number  = 0; 

  public rSFS:number = 0;
  public rAFP:number = 0;
  public rISR:number = 0;
  public asignaciones:Asignacion[]=[];
  public asignacion!:Asignacion;

  public isrF:number = 0;

  constructor(private fb:FormBuilder,
              private _empleadoService:EmpleadoService,
              private _deduccionService:DeduccionService,
              private _activatedRoute:ActivatedRoute,
              private _router: Router,
              private _retencionLeyService:RetencionLeyService,
              private _asignacionService:AsignacionService) { }



  ngOnInit(): void {

    this._activatedRoute.params.subscribe(({id}) => this.cargarDeduccion(id));

    this.formDeduccion = this.fb.group({
      empleado:['',Validators.required],
      sfs:[''],
      afp:[''],
      depAdicTSS:[''],
      retISR:[''],
      cxc:[''],
      otroDesc:['']

    })

     //Para llenar el comboBox de empleado
     this.cargarEmpleado();
     
     this.formDeduccion.get('empleado')?.valueChanges
        .subscribe(empleadoID=>{

          this.empleadoSeleccionado = this.empleados.find(e =>e._id === empleadoID)!;

          const {name1,name2, apell1, apell2, salario }= this.empleadoSeleccionado!
          this.nombreCompleto = this._empleadoService.nombreCompleto(name1,name2, apell1, apell2);
         
          this.salarioMensual = salario
          this.retencionLey(this.empleadoSeleccionado)

        })
  }
  

  cargarEmpleado(){
    this._empleadoService.cargarEmpleados()
        .subscribe(empleados=>{
          this.empleados = empleados;
          // console.log('Emple....', this.empleados)
        })
  }

  crearDeduccion(){
   
    const {
      sfs, afp, depAdicTSS,
      retISR, cxc, otroDesc
    } = this.formDeduccion.value;
    
    this.retencionLeyTotal = Number(sfs) + Number(afp) + Number(depAdicTSS) + Number(retISR);
    this.otrasDeducciones = Number(cxc), Number(otroDesc)

    this.totalRenglones = this.retencionLeyTotal + this.otrasDeducciones;

    const data = {
      ...this.formDeduccion.value,
      retencionesLey  :{sfs, afp,adicTSS:depAdicTSS, retISR},
      otrasDeducciones:{cxcEmpleado:cxc, otrosDescuentos:otroDesc }
    }

    if (this.deduccionSelecionada){
        // Actualiza
        const data  ={
          ...this.formDeduccion.value,
          retencionesLey  :{sfs, afp,adicTSS:depAdicTSS, retISR},
          otrasDeducciones:{cxcEmpleado:cxc, otrosDescuentos:otroDesc },
          _id:this.deduccionSelecionada._id
        }

        this._deduccionService.actualizarDeduccion(data)
        .subscribe(resp=>{
          Swal.fire( 'Actualizado', 'Deducción actualizada correctamente','success' );
        })  
    
    }
    else{
        // Crea
      this._deduccionService.crearDeduccion(data)
          .subscribe(resp=>{
            Swal.fire( 'Registrado', 'Deducción Registrada Correctamente','success' );
            this._router.navigateByUrl(`/nomina/deducciones`);
          });
    }
  }

  cargarDeduccion(id:string){

    if ( id === 'nuevo' ) {
      return;
    }
 
    this._deduccionService.obtenerDeduccionesByID(id)
        .pipe(
          delay(100)
        )
        .subscribe(deduccion =>{
          console.log('deduccion..: ', deduccion);
          console.log('name1..: ', deduccion.empleado.name1);
          console.log('afp..: ', deduccion.retencionesLey.afp);
          const { empleado:{_id},
                  retencionesLey:  { sfs , afp , adicTSS , retISR},
                  otrasDeducciones:{cxcEmpleado, otrosDescuentos }
          } = deduccion;

          this.formDeduccion.setValue({
                empleado:_id,
                sfs, afp, depAdicTSS:adicTSS, retISR,
                cxc:cxcEmpleado, otroDesc: otrosDescuentos
          });

          this.deduccionSelecionada = deduccion;

          //Totales TODO
          // this.totalRenglones = this.retencionLeyTotal + this.otrasDeducciones

        })
  }
 
   retencionLey(empleado:Empleado){
 
    //Calc RetencionesLey
    this._asignacionService.cargarAsignaciones()
        .subscribe(asignacion=>{
          this.asignaciones = asignacion;

          // Buscando asignacion correspondiente al empleado    
          this.asignacion =this.asignaciones.find(e =>e.empleado._id ===empleado._id)!;    
 
          const {comisiones, salario, vacaciones} = this.asignacion.salarioCotizableTSS
          this.salarioCotizableTSS =(salario* 2 + comisiones! + vacaciones! )

          this.rSFS = this.calcSFS(this.salarioCotizableTSS);
          this.formDeduccion.controls['sfs'].setValue(this.rSFS);

          this.rAFP = this.calcAFP(this.salarioCotizableTSS);
          this.formDeduccion.controls['afp'].setValue(this.rAFP);

          this.salarioCotizableISR = this.salarioCotizableTSS - ((this.rSFS +  this.rAFP)*2)
          this.rISR =  this.calcISR(this.salarioCotizableISR);
          this.formDeduccion.controls['retISR'].setValue(this.rISR);

        })
        
  }
 
  calcSFS(salario:number):number{
     return this._retencionLeyService.calcSFS(salario);
  }
 
  calcAFP(salario:number):number{
    return this._retencionLeyService.calcAFP(salario);
  }
   calcISR(salario:number):number{
   return (this._retencionLeyService.calcISR(salario) / 12) / 2;
  }

}
