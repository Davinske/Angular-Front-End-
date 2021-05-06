import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ProductoService } from '../productos/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Componente } from './models/componente';
import { MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura: Factura = new Factura();

  myControl = new FormControl();
  componentesFiltrados: Observable<Componente[]>;

  constructor(private productoService: ProductoService,
  private activatedRoute: ActivatedRoute,
  public facturasService: FacturasService,
  private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let productoId = +params.get('productoId');
      this.productoService.getProducto(productoId).subscribe(producto => this.factura.producto = producto);
    });

    this.componentesFiltrados = this.myControl.valueChanges
      .pipe(
        map(value => typeof value === 'string'? value: value.nombre),
        flatMap(value => value ? this._filter(value): [])
      );
  }
    private _filter(value: string): Observable<Componente[]> {
    const filterValue = value.toLowerCase();

    return this.facturasService.filtrarComponentes(filterValue);
  }


  mostrarNombre(componente?: Componente): string | undefined {
    return componente? componente.nombre: undefined;
  }

  seleccionarComponente(event: MatAutocompleteSelectedEvent): void{
    let componente = event.option.value as Componente;
    console.log(componente);

    if(this.existeItem(componente.id)){
      this.incrementaCantidad(componente.id);
    }else{
     let nuevoItem = new ItemFactura();
     nuevoItem.componente = componente;
     this.factura.items.push(nuevoItem);
    }
     this.myControl.setValue('');
     event.option.focus();
     event.option.deselect();
  }

  actualizarCantidad(id:number, event: any): void{
    let cantidad: number = event.target.value as number;

    if(cantidad==0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      if(id === item.componente.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) =>{
      if(id === item.componente.id){
        existe = true;
      }
    });
    return existe;
  }


  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      if(id === item.componente.id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.componente.id);
  }

  create (facturaForm): void{
    console.log(this.factura);
    if(this.factura.items.length == 0){
      this.myControl.setErrors({'invalid': true});
    }
    if (facturaForm.form.valid && this.factura.items.length > 0){
    this.facturasService.create(this.factura).subscribe(factura => {
      swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito`, 'success');
      this.router.navigate(['/facturas', factura.id]);
    });
  }
}


}
