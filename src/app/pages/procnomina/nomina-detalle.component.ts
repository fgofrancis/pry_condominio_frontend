import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NominaService } from 'src/app/services/nomina.service';

import { NominaDetalle } from 'src/app/models/nominaDetalle.model';


@Component({
  selector: 'app-nomina-detalle',
  templateUrl: './nomina-detalle.component.html',
  styles: [
  ]
})
export class NominaDetalleComponent implements OnInit {

  public formNomina!:FormGroup;
  public nominaDetail!:NominaDetalle;

  public salarioCotizableTSS!:number;
  public otrasRemuneraciones!:number;
  public ingresosExentoISR!:number;
  public totalAsignacion!:number;
  
  public retencionesLey!:number;
  public otrasDeducciones!:number;
  public totalDeduccion!:number;


  public data:any[] = [];
  constructor( private _activatedRoute:ActivatedRoute,
               private fb:FormBuilder,
               private _nominaService:NominaService) { }

  ngOnInit(): void {
    // this._activatedRoute.params.subscribe(({id}) => this.cargarEscala(id));

    // this._activatedRoute.params.subscribe(paramas =>{
    //   console.log('Paramas.id', paramas);
    // });
    
    this._activatedRoute.params
            .subscribe(({idProcess,idEmpleado}) =>{
                this.cargarNominaByIdProcessByIdEmpleado(idProcess,idEmpleado)
    });

    this.formNomina = this.fb.group({
      Id:['99-9'],
      Nombre:['Francis'],
      Salario:['1'],
      SueldoQincenal:['1'],
      Comision:['1'],
      Vacaciones:['1'],
      Extras:['1'],
      Otros:['1'],
      Bonos:['1'],
      RegaliaPascual:['1'],
      IndemnizacionesLaborales:['1'],
      PreavisoYCesantia:['1'],
      Reembolsos:['1'],
      TotalAsig:['1'],
      SFS:['1'],
      AFP:['1'],
      adicTSS:['1'],
      ISR:['1'],
      CxC:['1'],
      OtrosDesc:['1'],
      TotalDed:['1']
    })

  }

  cargarNomina(IdProcess:string){
    this._nominaService.cargarNominaProcessID(IdProcess).subscribe((data)=>{
      console.log('data..: ', data);
    })
  }
  cargarNominaByIdProcessByIdEmpleado(idProcess:string, idEmpleado:string){
    this._nominaService.cargarNominaProcessIDidEmpleado(idProcess,idEmpleado)
          .subscribe((data) =>{
               this.nominaDetail = data;
              //  debugger
               const { identificacion,
                       empleadoID:  { name1, apell1,sal},
                       asignacionID:{ salarioCotizableTSS:{ salario, comisiones, vacaciones},
                                      otrasRemuneraciones:{horasExtraDiasFeriados,otrosIngresos,bonosTrimestrales},
                                      ingresosExentoISR:  {regaliaPascual,indemnizacionesLaborales,preavisoYCesantia},
                                      reembolsos //, fechaRegistro Need an alias in backend me
                                  },
                       deduccionID:{ retencionesLey:{sfs, afp, adicTSS, retISR},
                                     otrasDeducciones:{cxcEmpleado, otrosDescuentos}
                                     // fechaRegistro Need an alias in backend me
                                 },
                       
                       ...dataRest
               } = this.nominaDetail;

               
              this.salarioCotizableTSS = salario+ comisiones! + vacaciones!;
              this.otrasRemuneraciones = horasExtraDiasFeriados! + otrosIngresos! + bonosTrimestrales!;
              this.ingresosExentoISR   = regaliaPascual! + indemnizacionesLaborales! + preavisoYCesantia!;
              this.totalAsignacion     = this.salarioCotizableTSS + this.otrasRemuneraciones + this.ingresosExentoISR;
              
              this.retencionesLey   = sfs + afp + adicTSS! + retISR!;
              this.otrasDeducciones = cxcEmpleado! + otrosDescuentos!;
              this.totalDeduccion = this.retencionesLey + this.otrasDeducciones;
              
              // Llenando el formulario
              this.formNomina.setValue({
                    Id:identificacion,Nombre:name1 + apell1,Salario:salario,
                    SueldoQincenal:salario, Comision:comisiones, Vacaciones:vacaciones,
                    Extras:horasExtraDiasFeriados, Otros: otrosIngresos,Bonos:bonosTrimestrales, 
                    RegaliaPascual: regaliaPascual, IndemnizacionesLaborales: indemnizacionesLaborales,PreavisoYCesantia:preavisoYCesantia,
                    Reembolsos:reembolsos,
                    TotalAsig: this.totalAsignacion,
                    SFS:sfs, AFP:afp, adicTSS, ISR:retISR, CxC:cxcEmpleado, OtrosDesc:otrosDescuentos,
                    TotalDed: this.totalDeduccion
              });
       
    })
  }

}
