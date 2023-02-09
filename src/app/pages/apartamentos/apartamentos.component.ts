import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

// pdfMake 
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { debounceTime, tap } from 'rxjs/operators';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Apartamento } from 'src/app/models/apartamento.model';
import { Procesocuota } from 'src/app/models/procesocuota.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { CuotasService } from 'src/app/services/cuotas.service';

import { ModalCuotasService } from 'src/app/services/modal-cuotas.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-apartamentos',
  templateUrl: './apartamentos.component.html',
  styles: [
  ]
})
export class ApartamentosComponent implements OnInit {

  public apartamentos:Apartamento[] = [];
  public apartamento!:Apartamento
  public cargando:boolean = false;
  public desde:number   = 0;
  public limite:number  = 5;
  
  public pagina:number = 5;
  public totalApartamento:number = 0;
  public procesocuotamax : Procesocuota[] = [];
  public fechaProcesoMax! : Date; 


  constructor( private _apartamentoService:ApartamentosService,
               private _busquedaService:BusquedasService,
               private _cuotaService:CuotasService,
               private _modalCuotasService:ModalCuotasService)
             { }

  ngOnInit(): void {
     this.cargarApartamentos();
     this.buscarProcesoCuotaMax(); //Denny this procedure I liked call it simulateamente with report
     // but doesn´t. 
    
  }

  buscar(termino:string){
    if(termino.length === 0 ){
      return this.cargarApartamentos();
    }
 
    //Tengo el resultados del tipo any pero no me gusta.
   this._busquedaService.buscar('apartamentos',termino)
      .subscribe( resultados => {
        this.apartamentos = resultados as Apartamento[]
      });
  }

  cargarApartamentos(){
      // this.cargando = true;
      this._apartamentoService.cargarApartamentos(this.desde,this.limite)
            .subscribe(({total, apartamentos}) =>{
                    this.apartamentos = apartamentos;
                    this.totalApartamento = total
      })
  };

  buscarProcesoCuotaMax(){
    this._cuotaService.buscarProcesoCuotasMax().subscribe(
      (resp)=>{
        this.procesocuotamax = resp;
      
         //Denny,the backend send me an array, but could is a object, no an objet´s array
         this.fechaProcesoMax = resp[0].fechaproceso;
         console.log('this.fechaProcesoMax..: ', this.fechaProcesoMax)
      },
      (err)=>{
        Swal.fire('Informativo',err.error?.msg,'info');
      }
    )

  };

  imprimirApartamentos(){
      // this.cargando = true;
      this._apartamentoService.cargarApartamentos()
      // .pipe( //Denny it debounceTime no save, why?
      //   debounceTime(1000),
      //   tap(()=>{ this.buscarProcesoCuotaMax()})
      // )
      .subscribe(({total, apartamentos}) =>{
              this.apartamentos = apartamentos;
              this.totalApartamento = total;
      })
  };
    
  eliminarApartamento(apartamento: Apartamento){
    Swal.fire({
      title: 'Borrar apartamento?',
      text: `Está a punto de borrar el apartamento ${apartamento.codigo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this._apartamentoService.eliminarApartamentoById(apartamento._id)
          .subscribe(resp => {
            this.cargarApartamentos();
            Swal.fire(
              'apartamento borrado',
              `El apartamento ${ apartamento.codigo } fue eliminado correctamente`,
              'success'
            )}
          );
      }
    })
 
  };

  abrirModal(apartamento: Apartamento){
    this._cuotaService.buscarCuotaByIdApartamento(apartamento._id)
          .subscribe((cuota)=>{
            this._modalCuotasService.modal$.emit(cuota);
          })
          
    this._modalCuotasService.abrirModal();      
  
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;
    this.pagina += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
      this.pagina = 5;
    } else if ( this.desde >= this.totalApartamento ) {
      this.desde -= valor; 
      this.pagina = this.totalApartamento
    }

    this.cargarApartamentos();
  };

  reporte(){

    this.imprimirApartamentos();

    let docDefinition:any ={

      footer: {
        columns: [
          // { text: 'Cosmos Digital SRL RNC:1-31-98720-6 Phone: 809-224-1509 Email:francisfiguereo@cdigital.com',
          { text: 'RNC. 4-30-17865-9   Tel.  809-224-1509 /  condominioplazamirador43@gmail.com ',
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

        {
          columns:[
            [
              {
                // text:`Estado de Cuentas al: ( *** ${this.fechaProcesoMax} *** )`,
                text:`Estado de Cuentas al:  (  *** ${new Date(this.fechaProcesoMax).toLocaleString('es-es', {  year:"numeric", month:"long", day:"numeric"}) }  *** )`,
                // text:`Estado de Cuentas al 30 de Noviembre 2022`,
                bold:true,
                color: '#047886',
                fontSize: 13, 
              },
            ],
            // [
            //   {
            //     // text: `Fecha: ${new Date().toLocaleString()}`,
            //     text: `${new Date().toLocaleString()}`,
            //     alignment: 'right'
            //   }
            // ]
          ]
        },
        {
          table:{
            headerRows: 1,
            widths: ['*','auto', 'auto', 'auto', 'auto'],
            body: [
              [ {text:'CODIGO', bold:true}, {text:'PROPIETARIO', bold:true},  {text:'CUOTA',bold:true},
                {text:'ULTIMA CUOTA GENERADA', bold:true}, {text:'BALANCE',bold:true} ],
              ...this.apartamentos.map(p => ([ p.codigo, p.idpropietario.nombre, {text: p.idbloque.cuota.toLocaleString('en-ES', {style: 'decimal',currency: 'USD', minimumFractionDigits: 2}), alignment:'right'},
                                                new Date(p.fechaultimacuota).toLocaleDateString('es-es', {  year:"numeric", month:"short", day:"numeric"}), 
                                               {text: p.saldomantenimiento.toLocaleString('en-ES', {style: 'decimal',currency: 'USD', minimumFractionDigits: 2} ),alignment:'right'}
                                              ])
                                      ),
              // ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
              [{ text: 'Total Apartamentos', colSpan: 1, bold:true}, { text: this.apartamentos.reduce((sum, p)=> sum + (1), 0), bold:true},
               { text: this.apartamentos.reduce((sum, p)=> sum + (p.idbloque.cuota), 0).toLocaleString('en-ES', {style: 'decimal',currency: 'USD', minimumFractionDigits: 2}), alignment:'right', bold:true},{},
               { text: this.apartamentos.reduce((sum, p)=> sum + (p.saldomantenimiento), 0).toLocaleString('en-ES', {style: 'decimal',currency: 'USD', minimumFractionDigits: 2}), alignment:'right', bold:true}]
            ]
          }
        },
        [
          {
            text: `impresión: ${new Date().toLocaleString()}`,
            alignment: 'right'
          }
        ],
        [
          { text:' '},
          {
            text: `Nota:`,
            alignment: 'left',
            bold:true,
            fontSize:14
          },
          {
            text: `Los apartamentos con fechas de ULTIMA CUOTA GENERADA mayores a la fecha de corte, ${new Date(this.fechaProcesoMax).toLocaleString('es-es', {  year:"numeric", month:"long", day:"numeric"}) }, corresponden a compromisos a futuro producto de pagos por adelantado.`,
            alignment: 'left',
            italics: true
          }
        ]
      ]
       
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }
}
