import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { ContabilidadModule } from './contabilidad/contabilidad.module';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';

//Date Import
import localePy from '@angular/common/locales/es-DO';
import {registerLocaleData } from '@angular/common';
registerLocaleData(localePy,'es');

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule,
    AuthModule,
    ContabilidadModule,
    ComponentsModule
  ],
  providers: [{ provide:LOCALE_ID, useValue:'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
