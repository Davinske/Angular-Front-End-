import { Componente } from './componente';

export class ItemFactura {
  componente: Componente;
  cantidad: number = 1;
  importe: number;

  public calcularImporte(): number{
    return this.cantidad * this.componente.precio;
  }
}
