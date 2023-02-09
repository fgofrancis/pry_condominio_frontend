import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Compania } from 'src/app/models/compania.model';
import { CompaniaService } from 'src/app/services/compania.service';

@Component({
  selector: 'app-compania-m',
  templateUrl: './compania-m.component.html',
  styles: [
  ]
})
export class CompaniaMComponent implements OnInit {

  public formCompania: FormGroup; 
  public compania!:Compania[];
 
  constructor(private _router:Router,
              private fb:FormBuilder,
              private _companiaService:CompaniaService) {

     this.formCompania = this.fb.group({
        name:['',Validators.required ],
        rnc:['',Validators.required ],
        telefono:['', ],
        email:['', ]
     })
  }

  
  ngOnInit(): void {
  }

  grabarCia(){
    // console.log(this.formCompania.value); 
    this._companiaService.crearCompania(this.formCompania.value)
        .subscribe( resp =>{
          console.log('Compania registrada');
          Swal.fire( 'Registrado',this.formCompania.get('name')?.value,'success' );
          this._router.navigateByUrl('/nomina/compania');
        })
  }
}
