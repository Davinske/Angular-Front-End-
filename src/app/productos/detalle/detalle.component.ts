import { Component, OnInit, Input } from '@angular/core';
import { Producto } from '../producto';
import { ProductoService } from '../producto.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { FacturasService} from '../../facturas/services/facturas.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'detalle-producto',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() producto: Producto;
  private fotoSeleccionada: File;
  titulo: string = "Imagen del vehículo";
  progreso: number = 0;

  constructor(private productoService: ProductoService,
     public modalService: ModalService,
     private facturassService: FacturasService) { }

  ngOnInit() {
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0)
      swal.fire('Error de formato', 'El archivo seleccionado no es de tipo IMAGE', 'error');
      this.fotoSeleccionada = null;
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      swal.fire('Error de subida','Error: debe seleccionar una foto', 'error')

    }else{
      this.productoService.subirFoto(this.fotoSeleccionada, this.producto.id).subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if (event.type === HttpEventType.Response){
          let response: any = event.body;
          this.producto = response.producto as Producto;
          swal.fire('La foto se ha subido correctamente', response.mensaje, 'success');

        }

      });
  }}

    cerrarModal(){
      this.modalService.cerrarModal();
      this.fotoSeleccionada = null;
      this.progreso = 0;
    }


    delete(factura:Factura): void{
      swal.fire({
          title: "¿Está seguro?",
          text: `Seguro que desea eliminar la factura ${factura.id} :${factura.descripcion}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, borrar"
        })
        .then(result => {
          if (result.value) {
            this.facturassService.delete(factura.id).subscribe(response => {
              this.producto.facturas = this.producto.facturas.filter(fac => fac !== factura);
              swal.fire(
                "Eliminado!",
                `La factura ${factura.descripcion} se ha eliminado con éxito`,
                "success"
              );
            });
          }
        });
    }

    

}
