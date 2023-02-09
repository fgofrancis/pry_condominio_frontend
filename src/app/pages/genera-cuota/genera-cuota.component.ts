import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Apartamento } from 'src/app/models/apartamento.model';
import { Cuota } from 'src/app/models/cuota.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { CuotasService } from 'src/app/services/cuotas.service';
import Swal from 'sweetalert2';

const FECHABASE = '1972-06-27';

const terminoSubject$ = new BehaviorSubject('');

@Component({
  selector: 'app-genera-cuota',
  templateUrl: './genera-cuota.component.html',
  styles: [
  ]
})
export class GeneraCuotaComponent implements OnInit, OnDestroy
 {

  public apartamentoForm!:FormGroup;
  public cargando:boolean = false;
  public cuotas:Cuota[]=[];
  public apartamentos:Apartamento[] = [];
  public fechacuotas!:Date ;
  public isbtnGenerarProceso:boolean = true;
  public isverApartamentos:boolean = false;

  constructor( private _cuotasService:CuotasService,
               private _busquedaService: BusquedasService,
               private _fb:FormBuilder,
               private _apartamentoService:ApartamentosService) {}
  
  
  ngOnDestroy(): void {
    terminoSubject$.complete();
  }

  ngOnInit(): void {
    this.apartamentoForm = this._fb.group({
      codigo:['',Validators.required],
      planta:['',Validators.required],
      idbloque:['',Validators.required],
      saldomantenimiento:[''],
      idpropietario:['',Validators.required],
      habitado:['']
    });
 
    this.fechacuotas = new Date(FECHABASE);
    // console.log('this.fechacuota..:',this.fechacuotas);

    this.cargarApartamentos();

    this.apartamentoForm.get('codigo')?.valueChanges.subscribe(resp=>{
      console.log('Cambio apto', resp);
      terminoSubject$.next(resp);
      this.buscar(resp);
    })
  
  }

  buscar(termino:string){
    terminoSubject$.next(termino);
    console.log('buscando....')
   //Tengo el resultados del tipo any pero no me gusta.
   this._busquedaService.buscar('cuotas',termino)
   .subscribe( resultados => {
    console.log('Cuotas cargadas', resultados)
     this.cuotas = resultados as Cuota[]
   });

  }

  /**
   * 
   * @param fechacuotas es simbólico, ya que uso el [(ngModel)] para alimentar la fechacuota
   */
  generarCuota(fechacuotas:string){
    this.isbtnGenerarProceso = true;
    this._cuotasService.generarCuotas(this.fechacuotas).subscribe(
      (resp)=>{
        Swal.fire('Cuotas','Proceso generado exitosamente','success');
        this.isverApartamentos= true;
        this.buscar(terminoSubject$.value);
    },
     (err)=>{
        Swal.fire('Informativo',err.error?.msg,'info');
     })

  }

    guardarApartamento(){}

  cargarApartamentos(){
    this._apartamentoService.cargarApartamentos().subscribe(
      ({apartamentos})=>{
        console.log('Apartamentos..: ', apartamentos)
        this.apartamentos = apartamentos
    },
    (err) =>{
      Swal.fire('Informativo',err.error?.msg,'error')
    })
  }

  capturarFechaOnChange(event:any){
    console.log(event.target.value);
    this.fechacuotas = event.target.value;
    this.isbtnGenerarProceso = false;
    this.isverApartamentos = false;
    this.cuotas =  [];
    console.log('Fecha proceso..:', this.fechacuotas);
  }

}
