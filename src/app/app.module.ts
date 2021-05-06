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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './productos/detalle/detalle.component';
import { LoginComponent } from './productos/usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

registerLocaleData(localeES, 'es');


const routes: Routes = [
  {path: '', redirectTo:'/productos' , pathMatch:'full'},
  {path: 'directivas', component: DirectivaComponent },
  {path: 'productos', component: ProductosComponent },
  {path: 'productos/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'productos/form/:id', component:FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'productos/page/:page', component: ProductosComponent },
  {path: 'login', component: LoginComponent },
  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'facturas/form/:productoId', component: FacturasComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} }

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
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ReactiveFormsModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule

  ],
  providers: [ProductoService,
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
