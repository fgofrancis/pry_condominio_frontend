import { Component, OnInit } from '@angular/core';

// pdfMake 
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Apartamento } from 'src/app/models/apartamento.model';
import { Propietario } from 'src/app/models/propietario.model';
import { ApartamentosService } from 'src/app/services/apartamentos.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalApartamentoService } from 'src/app/services/modal-apartamento.service';
import { PropietariosService } from 'src/app/services/propietarios.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-propietarios',
  templateUrl: './propietarios.component.html',
 
})
export class PropietariosComponent implements OnInit {

  public propietarios:Propietario[] = [];
  public propietariosTemp:Propietario[] = [];
  public propietario!:Propietario
  public cargando:boolean = false;
  public desde:number  = 0;
  public limite:number  = 5;

  public pagina:number = 5;
  public totalPropietario:number = 0;
  public apartamentos:Apartamento[] = [];

  constructor( private _propietarioService:PropietariosService,
               private _busquedaService:BusquedasService,
               private _modalAptoService:ModalApartamentoService,
               private _apartamentoService:ApartamentosService) { }

  ngOnInit(): void {
     this.cargarPropietarios();
  }

  buscar(termino:string){
    if(termino.length === 0 ){
      return this.cargarPropietarios();
      // return this.propietarios = this.propietariosTemp 
    }

    //Tengo el resultados del tipo any pero no me gusta.
   this._busquedaService.buscar('propietarios',termino)
      .subscribe( resultados => {
        this.propietarios = resultados as Propietario[]
      });
    return;
  }
 
  cargarPropietarios(){
      // this.cargando = true;
      this._propietarioService.cargarPropietarios(this.desde,this.limite).subscribe(({total, propietarios}) =>{
        this.propietarios = propietarios;
        this.totalPropietario = total
      })
  }
  imprimirPropietarios(){
      // this.cargando = true;
      this._propietarioService.cargarPropietarios().subscribe(({total, propietarios}) =>{
        this.propietarios = propietarios;
        this.totalPropietario = total
      })
  }
    
  eliminarPropietario(propietario: Propietario){
    Swal.fire({
      title: 'Borrar propietario?',
      text: `Está a punto de borrar el propietario ${propietario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this._propietarioService.eliminarPropietarioById(propietario._id)
          .subscribe(resp => {
            this.cargarPropietarios();
            Swal.fire(
              'propietario borrado',
              `El propietario ${ propietario.nombre } fue eliminado correctamente`,
              'success'
            )}
          );
      }
    })

  };
 
  cambiarPagina( valor: number ) {
    this.desde += valor;
    this.pagina += valor;

    if ( this.desde < 0 ) {
      this.desde  = 0;
      this.pagina = 5;
    } else if ( this.desde >= this.totalPropietario ) {
      this.desde -= valor; 
      this.pagina = this.totalPropietario;
    }
    this.cargarPropietarios();

  }

  abrirModal(propietario: Propietario){
    this._apartamentoService.buscarApartamentoByIdPropietario(propietario._id)
          .subscribe((apartamento)=>{
            this._modalAptoService.modal$.emit(apartamento);
          })
    this._modalAptoService.abrirModal();      
  
  }
  reporte(){

    this.imprimirPropietarios();

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

        {
          columns:[
            [
              {
                text:'Listado de Propietarios',
                bold:true,
                color:'blue'
              },
            ],
            [
              {
                text: `Fecha: ${new Date().toLocaleString()}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          table:{
            headerRows: 1,
            widths: ['*','auto', 'auto', 'auto'],
            body: [
              [  'PROPIETARIO', 'ID',  'PHONE CASA', 'PHONE MOVIL'],
              ...this.propietarios.map(p => ([ p.nombre, p.identificacion, p.telefonos.casa, p.telefonos.celular])),
              // ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
               [{text: 'Total propietarios', colSpan: 3}, {}, {}, this.propietarios.reduce((sum, p)=> sum + (1), 0)]
            ]
          }
        }
      ]
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }
  
}
