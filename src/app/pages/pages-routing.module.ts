import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { AcountSettingsComponent } from './acount-settings/acount-settings.component';
import { AsignacionComponent } from './asignaciones/asignacion.component';
import { AsignacionesComponent } from './asignaciones/asignaciones.component';
import { CompaniaMComponent } from './compania-m/compania-m.component';
import { CompaniaComponent } from './compania/compania.component';
import { ConstribucionleyComponent } from './constribucionley/constribucionley.component';
import { DeduccionComponent } from './deducciones/deduccion.component';
import { DeduccionesComponent } from './deducciones/deducciones.component';
import { EmpleadoMComponent } from './empleado/empleado-m.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { EscalaComponent } from './escalasalarial/escala.component';
import { EscalasalarialComponent } from './escalasalarial/escalasalarial.component';
import { PagesComponent } from './pages.component';
import { ParametroComponent } from './parametrosgenerales/parametro.component';
import { ParametrosgeneralesComponent } from './parametrosgenerales/parametrosgenerales.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProcnominaComponent } from './procnomina/procnomina.component';
import { NominaDetalleComponent} from './procnomina/nomina-detalle.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

import { BloquesComponent } from './bloques/bloques.component';
import { BloqueComponent } from './bloques/bloque.component';
import { PropietariosComponent } from './propietarios/propietarios.component';
import { PropietarioComponent } from './propietarios/propietario.component';
import { ApartamentosComponent } from './apartamentos/apartamentos.component';
import { ApartamentoComponent } from './apartamentos/apartamento.component';
import { GeneraCuotaComponent } from './genera-cuota/genera-cuota.component';
import { ReciboComponent } from './recibo/recibo.component';
import { ConsultarPagosComponent } from './consultar-pagos/consultar-pagos.component';
  
const routes: Routes = [
  { 
    path:'', 
    component: PagesComponent,
    canActivate:[ AuthGuard],
    canLoad:[ AuthGuard ],
    children:[
      // { path:'', component:RxjsComponent, data:{titulo: 'Rxjs'}},
      { path:'', component: AcountSettingsComponent, data:{titulo: 'Configuraciòn'}},
      { path:'acount-setting', component: AcountSettingsComponent, data:{titulo: 'Configuraciòn'}},
     
      { path:'bloques', component: BloquesComponent, data:{titulo: 'Mantenimiento de Bloques'}},
      { path:'bloque/:id', component: BloqueComponent, data:{titulo: 'Mantenimiento de Bloques'}},
      
      { path:'propietarios', component: PropietariosComponent, data:{titulo: 'Mantenimiento de Propietarios'}},
      { path:'propietario/:id', component: PropietarioComponent, data:{titulo: 'Mantenimiento de Propietario'}},
      
      { path:'apartamentos', component: ApartamentosComponent, data:{titulo: 'Mantenimiento de Apartamentos'}},
      { path:'apartamento/:id', component: ApartamentoComponent, data:{titulo: 'Mantenimiento de Apartamento'}},
      
      { path:'recibo', component: ReciboComponent, data:{titulo: 'Aplicar pago'}},
      
      { path:'consultar-pagos', component:ConsultarPagosComponent, data:{titulo: 'Consultar Pagos'}},
      
      { path:'asignaciones', component:AsignacionesComponent, data:{titulo: 'Mantenimiento de Asignaciones'}},
      { path:'asignacion/:id', component:AsignacionComponent, data:{titulo: 'Asignaciones'}},
      
      { path:'generacuotas', component:GeneraCuotaComponent, data:{titulo: 'Generar Cuota'}},
      
      { path:'deducciones', component:DeduccionesComponent, data:{titulo: 'Mantenimiento de Deducciones'}},
      { path:'deduccion/:id', component:DeduccionComponent, data:{titulo: 'DEDUCCION'}},
      
      { path:'compania', component:CompaniaComponent, data:{titulo: 'Mantenimiento de Compañías'}},
      { path:'companiaM', component:CompaniaMComponent, data:{titulo: 'Compañía'}},
     
      { path:'constribuciones', component:ConstribucionleyComponent, data:{titulo: 'Constribuciones de Ley'}},
      { path:'deducciones', component:DeduccionesComponent, data:{titulo: 'Deducciones'}},
     
      { path:'empleado', component:EmpleadoComponent, data:{titulo: 'Mantenimiento de Empleado'}},
      { path:'empleadoM', component:EmpleadoMComponent, data:{titulo: 'Empleado'}},
      // { path:'empleadoM/:id', component:BloqueComponent, data:{titulo: 'Bloque'}},
     
      { path:'escalaSalarial', component:EscalasalarialComponent, data:{titulo: 'Escala Salarial'}},
      { path:'escala/:id', component:EscalaComponent, data:{titulo: 'Escala '}},
     
      { path:'parametros', component:ParametrosgeneralesComponent, data:{titulo: 'Parámetros Generales'}},
      { path:'parametros/:id', component:ParametroComponent, data:{titulo: 'Parámetro'}},
      
      { path:'perfil', component: PerfilComponent, data:{titulo: 'Perfil de usuario'}},
      
      { path:'prcnomina', component:ProcnominaComponent, data:{titulo: 'Generación de Nómina'}},
      { path:'prcnomina/:idProcess', component:NominaDetalleComponent, data:{titulo: 'Nómina Detalle'}},
      { path:'prcnomina/:idProcess/:idEmpleado', component:NominaDetalleComponent, data:{titulo: 'Nómina Detalle'}},
     
      // { path:'rxjs', component: RxjsComponent, data:{titulo: 'Rxjs'}},
      
      //Rutas de ADMIN_ROLE agregar AdminGuard
      { path:'usuario',canActivate:[AdminGuard], component: UsuariosComponent, data:{titulo: 'Mantenimiento de Usuarios'}}
      
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
