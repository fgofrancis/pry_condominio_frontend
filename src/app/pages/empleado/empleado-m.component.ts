import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Compania } from 'src/app/models/compania.model';
import { Empleado } from 'src/app/models/empleado.model';
import { CompaniaService } from 'src/app/services/compania.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado-m',
  templateUrl: './empleado-m.component.html',
  styleUrls: ['./empleado-m.component.css']
})
export class EmpleadoMComponent implements OnInit {

  public formEmpleado!:FormGroup;
  public companias:Compania[] = [];
  public companiaSeleccionada?:Compania;
  public empleadoSeleccionado?:Empleado;

  constructor( private fb:FormBuilder,
               private _empleadoService:EmpleadoService,
               private _router:Router,
               private _companiaService:CompaniaService,
               private _activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    // toma todos los parametros q vienen desde la url 
    this._activatedRoute.params.subscribe(({id}) => this.cargarEmpleado(id));

  
    this.formEmpleado = this.fb.group({
      identificacion:['',Validators.required],
      name1:['',Validators.required],
      name2:[],
      apell1:['',Validators.required],
      apell2:[],
      email:[],
      fechaIngreso:[],
      salario:['',Validators.required],
      img:[],
      companiaID:['',Validators.required],
      fechaSalida:[]
   });
 
   this.cargarCompanias();
   
   // Esto es un observable para cada vez q cambie una compania en lo combox
   this.formEmpleado.get('companiaID')?.valueChanges
       .subscribe( companiaID=>{  
  
         // Esto es para tomar la cia en memoria, previamente cargada en el 
          //  metodo this.cargarCompanias
        this.companiaSeleccionada = this.companias.find(h =>h._id === companiaID );

       })
  }

  cargarEmpleado(id:string){

    if ( id === 'nuevo' ) {
      return;
    } 
      this._empleadoService.obtenerEmpleadoByID(id)
        .pipe(
          delay(100)
        )
          .subscribe(empleado =>{

            const {identificacion,name1, name2, apell1,apell2, 
                   email,fechaIngreso, salario, img, fechaSalida, companiaID:{_id} } = empleado
            
                this.formEmpleado
                .setValue({identificacion,name1,name2, apell1,apell2,
                           email,fechaIngreso, salario,img, fechaSalida, companiaID:_id});

            this.empleadoSeleccionado = empleado;
          })

  }

  //Aplicaré esto mismo para capturar el nombre de la cia del usuario y ponerlo
    // en el menú
  cargarCompanias(){
    this._companiaService.cargarCompanias()
        .subscribe((companias: Compania[])=>{
           this.companias = companias;
        })
  }
  crearEmpleado(){

    const {name1,name2, apell1, apell2 }= this.formEmpleado.value

    if (this.empleadoSeleccionado){
      //actualizar empleado
      const data = {
        ...this.formEmpleado.value,
        _id: this.empleadoSeleccionado._id
      }

      this._empleadoService.actualizarEmpleado( data )
          .subscribe(resp =>{
            // console.log('Actualizado..: ', resp);
            Swal.fire( 'Actualizado',`${this._empleadoService.nombreCompleto(name1,name2, apell1, apell2 )} actualizado correctamente`,
                       'success' );
          })
    }else{
      //crear
      this._empleadoService.crearEmpleado(this.formEmpleado.value)
            .subscribe((resp:any) =>{

              Swal.fire( 'Registrado',`${this._empleadoService.nombreCompleto(name1,name2, apell1, apell2 )} registrado correctamente`,
                         'success' );

              this._router.navigateByUrl(`/nomina/empleado`);
              // this._router.navigateByUrl(`/nomina/empleadoM/${resp.empleado._id}`);
            })
    }
  
  }
 
}
