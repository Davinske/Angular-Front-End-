import { Injectable } from '@angular/core';
import { Producto } from './producto';

import { Region } from './region';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthUsuarioService } from './usuarios/auth-usuario.service';


@Injectable()
export class ProductoService {

  private urlEndPoint: string = 'http://localhost:8098/api/productos';

  constructor(private http: HttpClient, private router: Router,
  private authService: AuthUsuarioService) { }

/*

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  Tambien eliminamos todos los headers -> {headers: this.agregarAuthorizationHeader()
  */


  // AUTORIZACION
  private isNoAutorizado(e): boolean {
    if (e.status == 401) {
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status == 403) {
      swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/productos']);
      return true;
    }
    return false;
  }



// OBTENER REGIONES
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }



// DEVUELVE LA MARCA EN MAYUSCULA
  getProductos(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response: any) => {
        console.log('ProductoService: tap 1');
        (response.content as Producto[]).forEach(producto => {
          console.log(producto.marca);
        })
      }),
      map( (response: any) => {
        (response.content as Producto[]).map(producto => {
          producto.marca = producto.marca.toUpperCase();
          producto.modelo = producto.modelo.toUpperCase();
          return producto;
        });
        return response;
      }),
      tap (response => {
        console.log('ProductoService: tap 2');
        (response.content as Producto[]).forEach(producto => {
          console.log(producto.marca);
        })
      })
    );
  }


  //MANEJO DE ERRORES
  create(producto: Producto): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, producto).pipe(
      catchError(e => {
        if ( this.isNoAutorizado(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }


//PODER EDITAR REGISTROS
  getProducto(id): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e =>{
        if ( this.isNoAutorizado(e)){
          return throwError(e);
        }
        this.router.navigate(['productos']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.errpr.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //MANEJO DE ERRORES
  update(producto: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.urlEndPoint}/${producto.id}`, producto).pipe(
      catchError(e => {
        if ( this.isNoAutorizado(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //MANEJO DE ERRORES
  delete(id: number): Observable<Producto>{
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if ( this.isNoAutorizado(e)){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }



  //SUBIR  FOTO
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

}
