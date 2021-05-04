import { Component, OnInit, Input } from '@angular/core';
import { Producto } from '../producto';
import { ProductoService } from '../producto.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

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
     public modalService: ModalService) { }

  ngOnInit() {
    /*this.activatedRoute.paramMap.subscribe(params => {
      let id:number = +params.get('id');
      if(id){
        this.productoService.getProducto(id).subscribe(producto => {
          this.producto = producto;
        });
      }
    });*/
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

}
