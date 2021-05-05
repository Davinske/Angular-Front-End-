import { Component } from '@angular/core';
import { AuthUsuarioService } from '../productos/usuarios/auth-usuario.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent{

  constructor(public authService: AuthUsuarioService, private router: Router){}

  logout(): void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal.fire('Logout', `Hola ${username}, has cerrado sesion con exito`, 'success');
  }

}
