import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Observable } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { Apartamento } from 'src/app/models/apartamento.model';
import { Cuota } from 'src/app/models/cuota.model';
import { Formapago } from 'src/app/models/formapago.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { CuotasService } from 'src/app/services/cuotas.service';
import { ReciboService } from 'src/app/services/recibo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styles: [
  ]
})
export class ReciboComponent implements OnInit {

  public cuotas:Cuota[] = [];
  public apartamentoForm!:FormGroup;
  public apartamentos:Apartamento[] = [];
  public totalSaldo:number = 0;
  public idapartamento:string = ''

  public montoPago:number = 0;
  
  public formapagos:Formapago[] = [];
  public idformapago:string = '';
  public comentarioPago:string = '';

  public formapagoSeleccionada! : Formapago;
  public isNotacredito : boolean = false;

  public isPagoHabilitado:boolean = false;

  // public fechaPago:Date = new Date();
  public fechaPago = new Date().toISOString().slice(0, 10);

  private buscarCuota$ = new  Observable<any>();
                            

  constructor( private _cuotaService:CuotasService,
               private _fb:FormBuilder,
               private _apartamentoService:ApartamentosService,
               private _reciboService:ReciboService) { }

  ngOnInit(): void {
    // this.fechaPago = new Date();

    this.apartamentoForm = this._fb.group({
      codigo:['',Validators.required],
      planta:['',Validators.required],
      idbloque:['',Validators.required],
      saldomantenimiento:[''],
      idpropietario:['',Validators.required],
      habitado:['']
    })

    this.cargarApartamentos();
    this.buscarFormapago();

    this.apartamentoForm.get('codigo')?.valueChanges.subscribe(idapartamento=>{
      this.idapartamento = idapartamento;
      console.log('Dime in ngOnInit()'); //Denny por que se dispara el ngOnInit() aquí?

      //Denny, I´m confused now
     this.buscarCuota$ = this._cuotaService.buscarCuotaByIdApartamento(this.idapartamento);

      this.buscar(idapartamento);

      this.montoPago = 0;
      this.isPagoHabilitado = false; 
    })
   this.montoPago = 0; 
   
  }

  buscar(idapartamento:string){
    this._cuotaService.buscarCuotaByIdApartamento(idapartamento)
      .pipe(
        tap((cuota:any) =>{
          this.calcDeudaTotal(cuota)
        })
      )
      .subscribe((cuota:any)=>{
            this.cuotas = cuota 
      })
  }
 
  guardarApartamento(){}

  cargarApartamentos(){
    this._apartamentoService.cargarApartamentos().subscribe(({apartamentos})=>{
      this.apartamentos = apartamentos
    })
  };

  buscarFormapago(){
    this._reciboService.buscarFormapago().subscribe(
      (formapagos)=>{
        this.formapagos = formapagos
      },
      (err)=>{
        console.log(err) // Denny esto está bién?
      }
    )
  };

  aplicarPago(){
    if(this.idformapago == ''){
      Swal.fire('Forma de pago',`Debe Elegir una forma de pago`, 'error');
      return
    };

    if(this.isNotacredito){
        if (this.comentarioPago == ''){
          Swal.fire('Comentario',`Debe comentar la Nota de Crédito`, 'warning');
          return;
        } 
    };
    
    this.isPagoHabilitado = false;

    const data = {idapartamento: this.idapartamento, monto:this.montoPago,
                  fecha:this.fechaPago, idformapago:this.idformapago, 
                  comentario:this.comentarioPago
    };

    this._reciboService.pagoCuota(data)
        .pipe(
          delay(1000),
          switchMap((resp)=>{
            return this.buscarCuota$;
          })
        )
        .subscribe(
          (resp)=>{
                this.montoPago = 0;
                this.cuotas = resp;
                this.calcDeudaTotal(resp);
                Swal.fire('Recibo',`Pago de: ${ data.monto } Aplicado correctamente`, 'success');
            },
            (error)=>{
              console.log(error);
            }
        );
  }

  private calcDeudaTotal(cuotas:Cuota[]):void{
    this.totalSaldo = 0;
          this.cuotas = cuotas
          this.cuotas.forEach((cuota)=>{
              this.totalSaldo += cuota.saldo
          });
  }

  habilitarPago(montoPago:number){
    this.isPagoHabilitado = (montoPago > 0)? true: false;  
  }

  catFormapago(){
    this.isNotacredito = false;
    this.formapagoSeleccionada = this.formapagos.find(f => f._id === this.idformapago)!

    if (this.formapagoSeleccionada.formapago === 'NotaCR'){
      this.isNotacredito = true;
    }

  }
}
