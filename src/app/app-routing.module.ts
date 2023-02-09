import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [
  {
    path:'auth',
    loadChildren: ()=> import('./auth/auth.module').then(a => a.AuthModule)
  },
  {
    path:'nomina',
    loadChildren: ()=> import('./pages/pages.module').then(n => n.PagesModule)
  },
  {
    path:'contabilidad',
    loadChildren: ()=> import('./contabilidad/contabilidad.module').then(c => c.ContabilidadModule)
  },
  
  { path: '', redirectTo: '/nomina', pathMatch: 'full' },
  { path: '**', component:NopagefoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
