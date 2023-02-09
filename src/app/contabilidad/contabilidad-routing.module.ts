import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from '../pages/pages.component';
import { BalancegeneralComponent } from './balancegeneral/balancegeneral.component';
import { BalanzacomprobacionComponent } from './balanzacomprobacion/balanzacomprobacion.component';
import { EntradadiarioComponent } from './entradadiario/entradadiario.component';
 
const routes: Routes = [
  {
    path:'', component: PagesComponent,
    canActivate:[ AuthGuard],
    children:[

      {path: 'balance', component: BalancegeneralComponent, data:{titulo:'Balance Generalxx'}},
      {path: 'entradadiario', component: EntradadiarioComponent, data:{titulo:'Entrada de Diario'}},
      {path: 'balanzacomprobacion', component: BalanzacomprobacionComponent, data:{titulo:'Balanza de Comprobación'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }
 