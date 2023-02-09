import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// pdfMake 
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Apartamento } from 'src/app/models/apartamento.model';
import { Pago } from 'src/app/models/pago.model';
import { Pagodetalle } from 'src/app/models/pagodetalle.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { ReciboService } from 'src/app/services/recibo.service';

const FECHABASE = '1972-06-27';

@Component({
  selector: 'app-consultar-pagos',
  templateUrl: './consultar-pagos.component.html',
  styles: [
  ]
})
export class ConsultarPagosComponent implements OnInit {

  public apartamentoForm!:FormGroup;
  public apartamentos: Apartamento[] = [];
  public idapartamento:string = '';

  public pagos:Pago[] =[];
  public pagodetalles:Pagodetalle[] = [];
  public isVerdetallepago:boolean = false;
  public fechapago!:Date ;
  public isPagoHabilitado:boolean = false;

  constructor(private _fb:FormBuilder,
              private _apartamentoService: ApartamentosService,
              private _reciboService:ReciboService) { }

  ngOnInit(): void {

      this.apartamentoForm = this._fb.group({
        codigo:['',Validators.required],
        planta:['',Validators.required],
        idbloque:['',Validators.required],
        saldomantenimiento:[''],
        idpropietario:['',Validators.required],
        habitado:['']
      });

      this.cargarApartamentos();

      this.apartamentoForm.get('codigo')?.valueChanges.subscribe(idapartamento=>{
        this.idapartamento = idapartamento
        
        if(!this.fechapago){
          this.fechapago = new Date('1972-06-27');
        }

        let criterio = {idapartamento:this.idapartamento, fechapago:this.fechapago}
        this.buscarPagos(criterio);
        this.isVerdetallepago = false;
      });

  }

  guardarApartamento(){}

  cargarApartamentos(){
    this._apartamentoService.cargarApartamentos().subscribe(({apartamentos})=>{
      this.apartamentos = apartamentos
    })
  }

  buscarPagos(criterio:{idapartamento:string, fechapago:Date }){
    this._reciboService.buscarReciboByIdApartamento(criterio.idapartamento, criterio.fechapago)
          .subscribe(
            (resp:any)=>{
                this.pagos = resp.pagos;
                this.isPagoHabilitado = (this.pagos.length > 0)?true:false; 
            },
            (err)=>{
              console.log(err);
            }
          )
  }

  buscarDetallePago(pago:Pago){
    this.isVerdetallepago = true;
    this._reciboService.buscarDetalleReciboByIdPago(pago._id).subscribe(
      (resp:any)=>{ 
       this.pagodetalles = resp.detallepago
       this.reporte(pago)
    },
    (err)=>{
      console.log(err);
    })
  }
  
  capturarFechaOnChange(event:any){
    // console.log(event.target.value);
    this.fechapago = event.target.value;

    if(!this.fechapago){
      this.fechapago = new Date(FECHABASE);
    }

    let criterio = {idapartamento:this.idapartamento, fechapago:this.fechapago}
    this.buscarPagos(criterio);
  }
  

 reporte(pago:Pago){

    var resto = (pago.saldodespuesdelpago > pago.saldoantedelpago )
                ?0
                :pago.saldodespuesdelpago

    let docDefinition:any ={
  
      footer: {
        columns: [
          { text: 'Cosmos Digital SRL RNC:1-31-98720-6 Phone: 809-224-1509 Email:francisfiguereo@cdigital.com',
            alignment: 'center',
            fontSize:8,
            bold:true,
            color:'#560189'
          }
        ]
      },
      content:[
        {  
          text: 'CONDOMINIO PLAZA MIRADOR',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886'  
        }, 
        { text:'Ave. Anacaona #43, Bella Vista D.N, R.D',
          alignment: 'center'
        },
        { text:'RNC 4-30-17865-9', alignment: 'center'},
        { text:' '},
        { text:' '},
        { text:' '},

        {
          text:`RECIBO DE PAGO APTO: `,
          bold:true,
          fontSize: 12,
          // color: '#047886'
        },
        {
          text:`${pago.idapartamento.codigo} `,
          fontSize: 25,
          bold:true,
          color: '#047886' 
        },
        { text:' '},
        {
          text:`Forma de pago: ${pago.idformapago.formapago}`,
          fontSize:12
        },
        {
          columns:[
            [
              {
                text:`Monto pago RD$: ${pago.monto.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2})}`,
                fontSize:12
                // bold:true,
                // color:'#047886'
              }
            ],
            [
              {
                text:`Fecha de pago: ${new Date(pago.fechageneracion).toLocaleString('es-ES', { year:"numeric", month:"short", day:"numeric"})}`,
                fontSize:12,
                // bold:true,
                // color:'#047886'
                alignment: 'right'
              }
            ]
          ]
        },
        {
          columns:[
            [
              {
                text:`Balance anterior RD$:${pago.saldoantedelpago.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2})}`,
                fontSize:12
              }
            ],
            [
              {
                // text:`Balance actual    RD$:${pago.saldodespuesdelpago.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2})}`,
                text:`Balance actual    RD$:${resto.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2})}`,
                fontSize:12,
                alignment: 'right'
              }
            ]
          ]
        },
        // { text:'*** '},
        {
          columns:[

            [
              {
                text:`Detalle del pago aplicado `,
                bold:true,
                color:'#047886',
                fontSize:14
              },
            ],
            // [
            //   {
            //     text: `Fecha recibo: ${ new Date(this.pagodetalles[0].fechageneracion).toLocaleString('es-ES', { year:"numeric", month:"short", day:"numeric"})}`,
            //     alignment: 'right'
            //   }
            // ]
          ]
        },
        {
          table:{
            headerRows: 1,
            widths: ['*','auto'],
            body: [
                    [  {text:'FECHA CUOTA', bold:true}, {text:'MONTO PAGO', bold:true} ],
                      ...this.pagodetalles.map(p => ([ new Date(p.idcuota.fechacuota).toLocaleDateString('es-es', { year:"numeric", month:"short", day:"numeric"}),
                          {text: p.monto.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2}), alignment:'right'},
                        ])
                      ),  
              [{text: 'Total Pagado', colSpan: 1, bold:true}, {text: this.pagodetalles.reduce((sum, p)=> sum + (p.monto * 1), 0).toLocaleString('en-ES', {style: 'decimal',currency: 'INR', minimumFractionDigits: 2}), alignment:'right', bold:true}]
            ]
          }
        },
        [
          {
            text: `impresión: ${new Date().toLocaleString()}`,
            alignment: 'right'
          }
        ]
      ]
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  };

  reporteGeneral(){
  
    let cantPago = this.pagos.length;
    let docDefinition:any ={

      footer: {
        columns: [
          { text: 'Cosmos Digital SRL RNC:1-31-98720-6 Phone: 809-224-1509 Email:francisfiguereo@cdigital.com',
            alignment: 'center',
            fontSize:8,
            bold:true,
            color:'#560189'
          }
        ]
      },
      content:[
        {  
          text: 'CONDOMINIO PLAZA MIRADOR',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886'  
        }, 
        { text:'Ave. Anacaona #43, Bella Vista D.N, R.D',
          alignment: 'center'
        },
        { text:'RNC 4-30-17865-9', alignment: 'center'},
        { text:' '},
        { text:' '},
        { text:' '},

        {
          text:`Pago realizado al apartamento: `
          // bold:true
        },
        {
          text:`${this.pagos[0].idapartamento.codigo} `,
          fontSize: 25,
          bold:true,
          color: '#047886' 
        },
        { text:' '},

        {
          columns:[

            [
              {
                text:`Cantidad de pagos aplicados :  *** ${cantPago} *** `,
                bold:true,
                color:'#047886',
                fontSize: 12
              },
            ],
            // [
            //   {
            //     text: `Fecha recibo: ${ new Date(this.pagos[0].fechageneracion).toLocaleString('es-ES', { year:"numeric", month:"short", day:"numeric"})}`,
            //     alignment: 'right'
            //   }
            // ]
          ]
        },
        {
          table:{
            headerRows: 1,
            widths: ['*','auto', 'auto'],
            body: [
                    [  {text:'FECHA PAGO', bold:true}, {text:'MONTO PAGO', bold:true}, {text:'FORMA PAGO', bold:true} ],
                        ...this.pagos.map(p => ([ new Date(p.fechageneracion).toLocaleDateString('es-es', { year:"numeric", month:"short", day:"numeric"}),
                             {text: p.monto.toLocaleString('en-ES', {style: 'decimal', currency: 'INR', minimumFractionDigits: 2}), alignment:'right'},
                             {text: p.idformapago.formapago, alignment:'right'}
                          ])
                        ),  
                    [ {text: 'Total Pagado',  bold:true}, 
                      {text: this.pagos.reduce((sum, p)=> sum + (p.monto * 1), 0).toLocaleString('en-ES', {style: 'decimal',currency: 'INR', minimumFractionDigits: 2}), alignment:'right', bold:true},
                      {}
                    ]
            ]
          }
        },
        [
          {
            text: `impresión: ${new Date().toLocaleString()}`,
            alignment: 'right'
          }
        ]
      ]
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

}
