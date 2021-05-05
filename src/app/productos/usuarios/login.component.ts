import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthUsuarioService } from './auth-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor, sign in';
  usuario: Usuario;

  constructor(private authService: AuthUsuarioService, private router: Router) { }

  ngOnInit(){
    if (this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.usuario.username} ya estas autenticado`, 'info');
      this.router.navigate(['/productos']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.password == null || this.usuario.username == null){
      swal.fire('Error login', '¡Username o password vacíos!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;
      this.router.navigate(['/productos']);
      swal.fire('Login', `Hola ${usuario.username}, has iniciado sesion correctamente`, 'success');
    }, err => {
      if (err.status == 400){
        swal.fire('Error Login', 'Usuario o clave incorrecta!', 'error');
      }
    });
  }

}
