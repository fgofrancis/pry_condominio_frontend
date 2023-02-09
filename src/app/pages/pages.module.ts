import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';

import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';

import { AcountSettingsComponent } from './acount-settings/acount-settings.component';
import { AsignacionesComponent } from './asignaciones/asignaciones.component';
import { CompaniaComponent } from './compania/compania.component';
import { CompaniaMComponent } from './compania-m/compania-m.component';
import { ConstribucionleyComponent } from './constribucionley/constribucionley.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { EmpleadoMComponent } from './empleado/empleado-m.component';
import { DeduccionesComponent } from './deducciones/deducciones.component';
import { EscalasalarialComponent } from './escalasalarial/escalasalarial.component';
import { PagesComponent } from './pages.component';
import { ParametrosgeneralesComponent } from './parametrosgenerales/parametrosgenerales.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProcnominaComponent } from './procnomina/procnomina.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EscalaComponent } from './escalasalarial/escala.component';
import { ParametroComponent } from './parametrosgenerales/parametro.component';
import { AsignacionComponent } from './asignaciones/asignacion.component';
import { DeduccionComponent } from './deducciones/deduccion.component';
import { NominaDetalleComponent } from './procnomina/nomina-detalle.component';
import { BloquesComponent } from './bloques/bloques.component';
import { BloqueComponent } from './bloques/bloque.component';
import { PropietariosComponent } from './propietarios/propietarios.component';
import { PropietarioComponent } from './propietarios/propietario.component';
import { ApartamentosComponent } from './apartamentos/apartamentos.component';
import { ApartamentoComponent } from './apartamentos/apartamento.component';
import { GeneraCuotaComponent } from './genera-cuota/genera-cuota.component';
import { ReciboComponent } from './recibo/recibo.component';
import { ConsultarPagosComponent } from './consultar-pagos/consultar-pagos.component';



// PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    EmpleadoComponent,
    EscalasalarialComponent,
    ParametrosgeneralesComponent,
    AsignacionesComponent,
    DeduccionesComponent,
    ProcnominaComponent,
    ConstribucionleyComponent,
    PagesComponent,
    AcountSettingsComponent,
    // RxjsComponent,
    PerfilComponent,
    UsuariosComponent,
    CompaniaComponent,
    CompaniaMComponent,
    EmpleadoMComponent,
    EscalaComponent,
    ParametroComponent,
    AsignacionComponent,
    DeduccionComponent,
    NominaDetalleComponent,
    BloquesComponent,
    BloqueComponent,
    PropietariosComponent,
    PropietarioComponent,
    ApartamentosComponent,
    ApartamentoComponent,
    GeneraCuotaComponent,
    ReciboComponent,
    ConsultarPagosComponent,
   

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
   
  ]
})
export class PagesModule { }
