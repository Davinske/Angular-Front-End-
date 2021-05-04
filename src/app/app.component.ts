import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a DFL Application';
  tienda: string = 'Tienda de productos';
  ubicacion: string = 'A Coruna';
}
