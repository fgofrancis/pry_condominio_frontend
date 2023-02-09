import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  public linktheme = document.querySelector('#theme');

  constructor() { 
    const url = localStorage.getItem('theme') || './assets/css/colors/green-dark.css';
    this.linktheme?.setAttribute('href', url);
  }

  changeTheme(theme: string){
    const url = `./assets/css/colors/${theme}.css`
    this.linktheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
 }
 
 checkCurrentTheme(){
   // Saltaremos al DOM cada vez que se ejecute esta instruccion.
  const links = document.querySelectorAll('.selector');

  links.forEach(element => {
    element.classList.remove('working');
    const btnTheme = element.getAttribute('data-theme');
    const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
    const currentTheme = this.linktheme?.getAttribute('href');

    if(btnThemeUrl === currentTheme ){
      element.classList.add('working');
    }
  });
  
}

}
