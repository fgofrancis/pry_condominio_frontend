import { Component, OnInit } from '@angular/core';
import { NominaService } from 'src/app/services/nomina.service';
import Swal from 'sweetalert2';
import {NominaResumen} from '../../models/nominaresumen.model';


@Component({
  selector: 'app-procnomina',
  templateUrl: './procnomina.component.html',
  styles: [
  ]
})
export class ProcnominaComponent implements OnInit {

  public nominaresumen!:NominaResumen[];
  public isPreparar:boolean = false;
  public isGenerar:boolean = true;

  constructor( private _nominaService:NominaService) { }

  ngOnInit(): void {
    this.generarNomina();
  }

  prepararNomina(){
      this._nominaService.cargarNomina().subscribe((data)=>{
          this.isPreparar = true;
          this.isGenerar = false;
          Swal.fire('Preparación','Nómina Preparada Exitosamente!!!','success');
      })
   }

   generarNomina(){
    this._nominaService.cargarNominaResumen().subscribe((data)=>{
      this.nominaresumen = data;
      if (!this.isGenerar){
        Swal.fire('Generación','Nómina Generada Exitosamente!!!', 'success')
      }
      this.isGenerar = true;
    })
   }
}
