import { Component, OnInit } from '@angular/core';
import { Producto } from './producto';
import { ProductoService } from './producto.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  productos: Producto[];
  paginador: any;
  productoSeleccionado: Producto;

  constructor(private productoService: ProductoService,
      private activatedRoute: ActivatedRoute,
      private modalService: ModalService) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
    let page:number = +params.get('page');

    if (!page) {
      page = 0;
    }

    this.productoService.getProductos(page).pipe(
      tap( response => {
        console.log('ProductosComponent: tap 3');
        (response.content as Producto[]).forEach(producto => {
          console.log(producto.marca);
        });
      })
    ).subscribe(
      response => {
        this.productos = response.content as Producto[];
        this.paginador = response;
      }
    );
  })
  }



  delete(producto: Producto): void {
      swal.fire({
          title: "¿Está seguro?",
          text: `Seguro que desea eliminar el vehículo ${producto.marca} ${producto.modelo}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, borrar"
        })
        .then(result => {
          if (result.value) {
            this.productoService.delete(producto.id).subscribe(response => {
              this.productos = this.productos.filter(pro => pro !== producto);
              swal.fire(
                "Eliminado!",
                `El vehiculo ${producto.marca} se ha eliminado con éxito`,
                "success"
              );
            });
          }
        });
    }

    abrirModal(producto: Producto){
      this.productoSeleccionado = producto;
      this.modalService.abrirModal();
    }

}
