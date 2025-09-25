import { ESTADOVENTA } from "src/enum/ventas.enum";

const transicionesValidas: Record<ESTADOVENTA, ESTADOVENTA[]> = {
  [ESTADOVENTA.PENDIENTE]: [ESTADOVENTA.PAGADO, ESTADOVENTA.CANCEL],
  [ESTADOVENTA.PAGADO]: [ESTADOVENTA.ENTREGADO, ESTADOVENTA.CANCEL],
  [ESTADOVENTA.CONFIRMAR]:[ESTADOVENTA.CANCEL,ESTADOVENTA.PAGADO],
  [ESTADOVENTA.ENTREGADO]: [],
  [ESTADOVENTA.CANCEL]: []
}

 export function validarTransicion(estadoActual: ESTADOVENTA, nuevoEstado: ESTADOVENTA) {
  return transicionesValidas[estadoActual]?.includes(nuevoEstado);
}
