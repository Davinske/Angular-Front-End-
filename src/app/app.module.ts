import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductoService} from './productos/producto.service';
import { RouterModule, Routes} from '@angular/router';
import { FormComponent } from './productos/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './productos/detalle/detalle.component';


registerLocaleData(localeES, 'es');


const routes: Routes = [
  {path: '', redirectTo:'/productos' , pathMatch:'full'},
  {path: 'directivas', component: DirectivaComponent },
  {path: 'productos', component: ProductosComponent },
  {path: 'productos/form', component: FormComponent },
  {path: 'productos/form/:id', component:FormComponent},
  {path: 'productos/page/:page', component: ProductosComponent }


]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ProductosComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [ProductoService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
