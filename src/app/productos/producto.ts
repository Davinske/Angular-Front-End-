import { Region } from './region';

export class Producto {
  id:number;
  marca:string;
  modelo:string
  fecha_de_produccion:string;
  foto:string;
  region: Region;
}
