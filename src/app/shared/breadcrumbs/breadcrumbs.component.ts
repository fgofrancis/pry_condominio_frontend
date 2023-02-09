import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo!: string;
  public tituloSub$!: Subscription;

  constructor(private _router: Router) { 
    this.tituloSub$ = this.getArgumentosRuta()
                        .subscribe( data =>{
                            this.titulo = data.titulo;
                            document.title = `Condominio - ${this.titulo}`;
                        });
  }
  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  getArgumentosRuta(){
    return this._router.events
    .pipe(
      filter( (event): event is ActivationEnd => event instanceof ActivationEnd),
      filter( (event:ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event:ActivationEnd) => event.snapshot.data )
    );
  }
}
