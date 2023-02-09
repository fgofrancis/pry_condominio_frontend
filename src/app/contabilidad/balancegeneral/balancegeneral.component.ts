import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente-form';

@Component({
  selector: 'app-balancegeneral',
  templateUrl: './balancegeneral.component.html',
  styleUrls: ['./balancegeneral.component.css']
})
export class BalancegeneralComponent implements OnInit {


  public dato:Cliente;
  public datos:Cliente[]=[];

  constructor() { 
    this.dato = {
      nombre:'',
      edad:'',
      telefono:'',
      empresa:''
    }
  }

  ngOnInit(): void {
  }

  enviar(){
    console.log(this.dato);
    // this.datos = this.dato 
    this.datos.push(this.dato);

    this.dato = {
      nombre:'',
      edad:'',
      telefono:'',
      empresa:''
    }
    
  }
}
