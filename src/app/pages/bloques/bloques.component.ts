import { Component, OnInit } from '@angular/core';
import { Bloque } from 'src/app/models/bloque.model';
import { BloquesService } from 'src/app/services/bloques.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bloques',
  templateUrl: './bloques.component.html',

})
export class BloquesComponent implements OnInit {

  public bloques:Bloque[] = [];
  public bloque!:Bloque
  public cargando:boolean = false;

  constructor( private _bloqueService:BloquesService,
               private _busquedaService:BusquedasService) { }

  ngOnInit(): void {
     this.cargarBloques();
  }

  buscar(termino:string){
    if(termino.length === 0 ){
      return this.cargarBloques();
    }

    //Tengo el resultados del tipo any pero no me gusta.
   this._busquedaService.buscar('bloques',termino)
      .subscribe( resultados => {
        this.bloques = resultados as Bloque[]
      });
  }

  cargarBloques(){
      // this.cargando = true;
      this._bloqueService.cargarBloques().subscribe(resp =>{
        this.bloques = resp;
      })
  }
    
  eliminarBloque(bloque: Bloque){
    Swal.fire({
      title: 'Borrar Bloque?',
      text: `Está a punto de borrar el Bloque ${bloque.codigo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this._bloqueService.eliminarBloqueById(bloque._id)
          .subscribe(resp => {
            this.cargarBloques();
            Swal.fire(
              'Bloque borrado',
              `El Bloque ${ bloque.codigo } fue eliminado correctamente`,
              'success'
            )}
          );
      }
    })

  }
  /**
   * Funcion q suma un mes a una fecha
   */
  TestFecha(){
    var enero = new Date(2022, 11, 25);
    console.log('Fecha1 ', enero);
    var febrero  = new Date(enero.setMonth(enero.getMonth()+1));
    console.log('Fecha2', febrero);

    let newFechacuota = new Date(2022, 13, 25 ); //Enero 25 del 2023
    console.log('newFechacuota..: ', newFechacuota)
  }
}  
