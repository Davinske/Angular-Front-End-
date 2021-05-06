import { Component, OnInit,  NgModule} from '@angular/core';
import { Producto } from './producto';
import { ProductoService } from './producto.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public producto: Producto = new Producto()
  regiones: Region[];
  public titulo:string = "INSERTAR NUEVO VEHÍCULO"

  private errores: string[]

  constructor(private productoService: ProductoService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit()  {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if(id){
        this.productoService.getProducto(id).subscribe((producto) => this.producto = producto);
      }

    });
    this.productoService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }


  cargarProducto(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.productoService.getProducto(id).subscribe( (producto => this.producto = producto))
      }
    })
  }


  update(): void {
    console.log(this.producto);
    this.producto.facturas = null; 
    this.productoService.update(this.producto)
    .subscribe(
      producto => {
      this.router.navigate(['/productos'])
      swal.fire('Vehiculo actualizado', `Vehiculo ${producto.marca}: ${producto.modelo} actualizado con exito`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error(err.error.errors);
      console.error('Codigo del error: ' + err.status);
    } );
  }


  public create(): void{
    console.log(this.producto);
    this.productoService.create(this.producto)
    .subscribe( producto => {
      this.router.navigate(['/productos'])
      swal.fire('Nuevo producto', `Producto ${producto.arca} creado con exito!`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error(err.error.errors);
      console.error('Codigo del error: ' + err.status);
    }
  );
  }

  compararRegion(o1:Region, o2:Region): boolean {
    if (o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null? false: o1.id===o2.id;
  }



}
