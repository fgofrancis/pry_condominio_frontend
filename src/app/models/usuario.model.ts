import { environment } from 'src/environments/environment';
import { Compania } from './compania.model';

const base_url = environment.base_url;

export class Usuario {

    constructor (
        // public companiaID: Compania,
        public nombre: string, 
        public correo: string, 
        public password: string, 
        public estado: boolean, 
        public role?: 'ADMIN_ROLE'| 'USER_ROLE',
        public img?: string,
        public google?: boolean, 
        public uid?: string

    ){}

    get imagenUrl(){

        if ( !this.img ){
            return `${base_url}/uploads/usuarios/no-imagen`;
        }else if (this.img?.includes('https')){
            return this.img;
        }else if ( this.img ){
            return `${base_url}/uploads/usuarios/${this.img}`;
        }else{
            return `${base_url}/uploads/usuarios/no-imagen`;

        }

    }

}
