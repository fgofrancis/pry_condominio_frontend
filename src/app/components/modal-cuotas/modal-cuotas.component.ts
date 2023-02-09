import { Component,  OnChanges,  OnDestroy,  OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

// pdfMake 
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Cuota } from 'src/app/models/cuota.model';
import { ModalCuotasService } from 'src/app/services/modal-cuotas.service';

@Component({
  selector: 'app-modal-cuotas',
  templateUrl: './modal-cuotas.component.html',
})
export class ModalCuotasComponent implements OnInit, OnDestroy {

  public cuotas:Cuota[]=[];
  public apartamento: string = '';
  public totalSaldo:number = 0;
  public isTotalSaldo: boolean = true;
  public modalData! : Subscription

  constructor( public _modalCuotasService:ModalCuotasService) { }
  
  ngOnDestroy(): void {
    this.modalData.unsubscribe();
  }
 

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas(){
   this.modalData = this._modalCuotasService.modal$
    .pipe(
      tap((cuota:any) =>{
        this.totalSaldo = 0;
        this.cuotas = cuota
        this.cuotas.forEach((cuota)=>{
            this.totalSaldo += cuota.saldo
        });
      })
    )
    .subscribe(cuotas=>{
      this.cuotas = cuotas;
      if (this.cuotas.length > 0){
        this.apartamento = cuotas[0].idapartamento.codigo;
      }else{
        this.apartamento = 'N/A'  //Debo resolver esto
      }
    })
  }
  
  cerrarModal(){
    this.totalSaldo = 0;
    this.isTotalSaldo = false;
    this._modalCuotasService.cerrarModal();
  }

  calcularTotales(cuota: Cuota[]){
    this.totalSaldo = 0;
    this.isTotalSaldo = true;
    // this.cuotas.forEach((cuota)=>{
      cuota.forEach((cuota)=>{
      this.totalSaldo += cuota.saldo
    })
  }

  reporte(){
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
          text:`Estado de Cuenta Apartamento: `
          // bold:true
        },
        {
          text:`${this.cuotas[0].idapartamento.codigo} `,
          fontSize: 25,
          bold:true,
          color: '#047886' 
        },
        { text:' '},

        {
          columns:[

            [
              {
                text:`Detalle cuotas pendientes de pago: ( ${this.cuotas.length} ) `,
                bold:true
              },
            ]
            // [
            //   {
            //     text: `Fecha de corte: ${new Date().toLocaleString()}`,
            //     alignment: 'right'
            //   }
            // ]
          ]
        },
        {
          // layout: 'lightHorizontalLines',
          // layout: 'headerLineOnly',
          // background: 'green',
          table:{
            headerRows: 1,
            widths: ['*','auto', 'auto'],
            body: [ 
                    [  {text:'FECHA CUOTA', bold:true}, {text:'MONTO CUOTA', bold:true}, {text:'SALDO CUOTA', bold:true}],
                      ...this.cuotas.map(c => ([ new Date(c.fechacuota).toLocaleDateString('es-es', { year:"numeric", month:"short", day:"numeric"}),
                                                 {text: c.monto.toLocaleString('en-ES', {style: 'decimal',currency: 'INR', minimumFractionDigits: 2}),alignment:'right'},
                                                 {text: c.saldo.toLocaleString('en-ES', {style: 'decimal',currency: 'INR', minimumFractionDigits: 2}),alignment:'right'}
                                                //  c.motivo, c.senal 
                                              ])
                                        ),  
              [{text: 'Total Adeudado', colSpan: 2, bold:true}, {}, {text: this.cuotas.reduce((sum, c)=> sum + (c.saldo * 1), 0).toLocaleString('en-ES', {style: 'decimal',currency: 'INR', minimumFractionDigits: 2}),alignment:'right', bold:true}]
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
