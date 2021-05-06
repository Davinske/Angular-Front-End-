import { Region } from './region';
import { Factura } from '../facturas/models/factura';

export class Producto {
  id:number;
  marca:string;
  modelo:string
  fecha_de_produccion:string;
  foto:string;
  region: Region;
  facturas: Array<Factura> = [];
}
