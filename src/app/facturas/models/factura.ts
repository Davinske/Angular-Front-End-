import { ItemFactura } from './item-factura';
import { Producto } from '../../productos/producto';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: Array<ItemFactura> = [];
  producto: Producto;
  total: number;
  createAt: string;

  calcularGranTotal(): number{
    this.total = 0;
    this.items.forEach((item:ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total; 
  }
}
