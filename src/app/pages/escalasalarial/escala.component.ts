import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EscalaSalarial } from 'src/app/models/escalaSalaria-model';
import { EscalaService } from 'src/app/services/escalas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escala',
  templateUrl: './escala.component.html',
  styles: [
  ]
})
export class EscalaComponent implements OnInit {

  public formEscala!: FormGroup;
  public escalaSeleccionada!: EscalaSalarial;

  constructor( private fb:FormBuilder,
               private _escalaService:EscalaService,
               private _router:Router,
               private _activatedRoute:ActivatedRoute){}
 
  ngOnInit(): void {

    this._activatedRoute.params.subscribe(({id}) => this.cargarEscala(id));
    
    this.formEscala = this.fb.group({
      year:['',Validators.required],
      renglon:[0,Validators.required],
      desde:[''],
      hasta:[''],
      tasa:[''],
      constante:['']     
})

  }

  cargarEscala(id:string){

    if ( id === 'nuevo' ) {
      return;
    }

    this._escalaService.obtenerEscalaByID(id)
          .subscribe(escala =>{

            const { year, renglon, desde, hasta, tasa,
                    constante} =escala;

            this.formEscala.setValue( { year, renglon, desde, hasta, tasa,
              constante});
            
            this.escalaSeleccionada = escala;
          })

  }

  crearEscala(){

    const {renglon} = this.formEscala.value;

    if(this.escalaSeleccionada){
      // actualizar renglon

      const data = {
        ...this.formEscala.value,
        _id: this.escalaSeleccionada._id
      }

      this._escalaService.actualizarRenglon(data)
          .subscribe(resp =>{
            Swal.fire( 'Actualizado',`Renglón No. ${renglon.toString() }` ,'success' );
            this._router.navigateByUrl('/nomina/escalaSalarial');
          })
 
    }else{
      // Crear renglon
      this._escalaService.crearEscala(this.formEscala.value)
         .subscribe((resp:any) =>{
           Swal.fire( 'Registrado',`Renglón No. ${renglon.toString() }` ,'success' );
           this._router.navigateByUrl('/nomina/escalaSalarial');
  
         })
    }

  }

}
