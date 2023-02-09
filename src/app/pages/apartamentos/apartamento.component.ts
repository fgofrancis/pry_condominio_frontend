import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Apartamento } from 'src/app/models/apartamento.model';
import { Bloque } from 'src/app/models/bloque.model';
import { Propietario } from 'src/app/models/propietario.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { BloquesService } from 'src/app/services/bloques.service';
import { PropietariosService } from 'src/app/services/propietarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apartamento',
  templateUrl: './apartamento.component.html',
  styles: [
  ]
})
export class ApartamentoComponent implements OnInit {

  public apartamentoForm!:FormGroup;
  public bloques:Bloque[]=[];
  public propietarios:Propietario[]=[];
  public apartamentoSeleccionado?: Apartamento;
  public bloqueSeleccionado?: Bloque;
  public propietarioSeleccionado?: Propietario;
  public cuotaAsignada:number = 0;
  public isMaskBlque:boolean = true;
 
  constructor(private fb:FormBuilder,
              private _apartamentoService:ApartamentosService,
              private _router:Router,
              private _activeRoute:ActivatedRoute,
              private _bloquesService:BloquesService,
              private _propietariosService:PropietariosService) { }


  ngOnInit(): void {

    this._activeRoute.params.subscribe(({id})=>{
      this.cargarApatartamento(id);

    })

    this.apartamentoForm = this.fb.group({
      codigo:['',Validators.required],
      planta:['Nivel I',Validators.required],
      idbloque:['',Validators.required],
      saldomantenimiento:['0'],
      idpropietario:['',Validators.required],
      habitado:['Propietario'],
      fechaultimacuota:['01-03-2022'],
      usuario:[]
     });

     this.cargarBloques();
      
     this.apartamentoForm.get('idbloque')?.valueChanges
         .subscribe( bloqueId =>{
           this.bloqueSeleccionado = this.bloques.find( b => b._id === bloqueId);
           const { cuota } = this.bloqueSeleccionado!

           if (this.isMaskBlque){
              this.apartamentoForm.get('codigo')?.patchValue(`${this.bloqueSeleccionado?.codigo}-`)
           } 
           this.isMaskBlque = true;
           
           this.cuotaAsignada = cuota
         });

     this.cargarPropietarios();
     this.apartamentoForm.get('idpropietario')?.valueChanges
         .subscribe( propietarioId =>{
           this.propietarioSeleccionado = this.propietarios.find( p => p._id === propietarioId);
         });
  };

  cargarBloques(){
    this._bloquesService.cargarBloques()
        .subscribe((bloques: Bloque[]) =>{
          this.bloques = bloques;
        });
  };

  cargarPropietarios(){
    this._propietariosService.cargarPropietarios()
        .subscribe(({propietarios}) =>{
          this.propietarios = propietarios;
          
        });
  }

  guardarApartamento(){

    //Tomando los datos del Formulario
    const { codigo, planta, idbloque,
            saldomantenimiento, idpropietario, habitado, fechaultimacuota,usuario
          } = this.apartamentoForm.value;
     
    //formando la data como la recibe la API
    const data = {
          ...this.apartamentoForm.value,
    };

    if(this.apartamentoSeleccionado){
      //Actualizar
      const data = {
        ...this.apartamentoForm.value,
        _id: this.apartamentoSeleccionado._id
        };
    

      this._apartamentoService.actualizarApartamentoById(data)
          .subscribe(
            (resp) =>{
                      Swal.fire('Actualizando',`Propietario ${ codigo } Actualizado correctamente`, 'success');
                      this._router.navigateByUrl('/nomina/apartamentos');
            }, 
            (err)=>{
                      Swal.fire('Error',err.error?.msg,'error');   
            } 
         )
    }else{
      //Crear
      this._apartamentoService.crearApartamento(data)
        .subscribe(
          (resp)=>{
                    Swal.fire('Registro',`apartamento ${resp.apartamento.codigo} gravado exitosamente`,'success');
                    this._router.navigateByUrl('/nomina/apartamentos');
          },
          (err)=>{
                    Swal.fire('Error',err.error?.msg,'error');
          }
        )
    }
  };

  cargarApatartamento(id:string){

    if (id === 'nuevo'){
      return;
    }

    this._apartamentoService.buscarApartamentoById(id).subscribe(apartamento =>{
      this.isMaskBlque = false;
      console.log('apartamento Update..:', apartamento)
      // La desestructuracion no me funciona, dice _id duplicado
      //  const { codigo, planta, idbloque:{_id},
      //          saldomantenimiento, idpropietario:{_id}, habitado
      //        } = apartamento;

      const codigo = apartamento.codigo;       
      const planta = apartamento.planta;       
      const idbloque = apartamento.idbloque._id;       
      const saldomantenimiento = apartamento.saldomantenimiento;       
      const idpropietario = apartamento.idpropietario._id; 
      const habitado = apartamento.habitado;       
      const fechaultimacuota = apartamento.fechaultimacuota;      
      const usuario = apartamento.usuario;      
     
      this.apartamentoSeleccionado = apartamento;

      this.apartamentoForm.setValue({codigo, planta, idbloque:idbloque, 
                                      saldomantenimiento,idpropietario:idpropietario, habitado,
                                      fechaultimacuota, usuario});
       return;
    })

  }


}
