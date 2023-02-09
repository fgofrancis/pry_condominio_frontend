import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { ModalApartamentosComponent } from './modal-apartamentos/modal-apartamentos.component';
import { ModalCuotasComponent } from './modal-cuotas/modal-cuotas.component';


@NgModule({
  declarations: [
    ModalImagenComponent,
    ModalApartamentosComponent,
    ModalCuotasComponent
  ],
  exports:[
    ModalImagenComponent,
    ModalApartamentosComponent,
    ModalCuotasComponent

  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
