import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[]= [
    { 
      titulo:'Nómina',
      icono:'mdi mdi-gauge',
      submenu:[
        {titulo: 'Bloques', url:'/nomina/bloques'},
        {titulo: 'Propietarios', url:'/nomina/propietarios'},
        {titulo: 'Apartamentos', url:'/nomina/apartamentos'},
        {titulo: 'Aplicar pago', url:'/nomina/recibo'},
        {titulo: 'Consultar Pagos', url:'/nomina/consultar-pagos'},
        {titulo: 'Generar Cuotas', url:'/nomina/generacuotas'},
        {titulo: 'Empleado', url:'/nomina/empleado'},
        {titulo: 'Compañía', url:'/nomina/compania'},
        {titulo: 'Escala Salarial', url:'/nomina/escalaSalarial'},
        {titulo: 'Parámetros Generales', url:'/nomina/parametros'},
        {titulo: 'Asignaciones', url:'/nomina/asignaciones'},
        {titulo: 'Deducciones', url:'/nomina/deducciones'},
        {titulo: 'Rxjs', url:'/nomina/rxjs'},
        {titulo: 'Usuario', url:'/nomina/usuario'},
        {titulo: 'Proceso Nómina', url:'/nomina/prcnomina'}
      ]
    },
    {
      titulo:'Contabilidad',
      icono:'mdi mdi-folder-lock-open',
      submenu:[
        {titulo: 'Balace generalyy', url:'/contabilidad/balance'},
        {titulo: 'Entrada de Diario', url:'/contabilidad/entradadiario'},
        {titulo: 'Balanza de comprobación', url:'/contabilidad/balanzacomprobacion'}
      ]
    }
  ];


  constructor() { }
}
