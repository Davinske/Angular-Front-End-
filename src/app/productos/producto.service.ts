import { Injectable } from '@angular/core';
//import { PRODUCTOS } from './productos.json';
import { Producto } from './producto';

import { Region } from './region';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ProductoService {

  private urlEndPoint: string = 'http://localhost:8098/api/productos';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})



  constructor(private http: HttpClient, private router: Router) { }


  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
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
          //let datePipe = new DatePipe('es-ES')
          //producto.fecha_de_produccion = datePipe.transform(producto.fecha_de_produccion, 'EEEE DD/MMM/yyyy');
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
      //return of(PRODUCTOS);
    );
  }


  //MANEJO DE ERRORES
  create(producto: Producto): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, producto, {headers: this.httpHeaders}).pipe(
      catchError(e => {

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
        this.router.navigate(['productos']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.errpr.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //MANEJO DE ERRORES
  update(producto: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.urlEndPoint}/${producto.id}`, producto, {headers: this.httpHeaders}).pipe(
      catchError(e => {

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
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
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
