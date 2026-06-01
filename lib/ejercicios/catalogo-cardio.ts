/** Catálogo centralizado de opciones aeróbicas (entrada en calor / vuelta a la calma). */
export interface OpcionCardio {
  id: string;
  nombre: string;
  /** Ruta bajo /public — p. ej. /gif/cardio/Bike-unscreen.gif */
  imagen: string;
  descripcion?: string;
}

export const OPCIONES_CARDIO: OpcionCardio[] = [
  {
    id: 'cinta',
    nombre: 'Cinta',
    imagen: '/gif/cardio/Assault-Air-Runner-unscreen.gif',
    descripcion: 'Correr en cinta con progresión de minutos',
  },
  {
    id: 'bici_fija',
    nombre: 'Bici fija',
    imagen: '/gif/cardio/Bike-unscreen.gif',
    descripcion: 'Bici estática vertical',
  },
  {
    id: 'bici_horizontal',
    nombre: 'Bici horizontal',
    imagen: '/gif/cardio/Recumbent-Exercise-Bike-unscreen.gif',
    descripcion: 'Bici reclinada, bajo impacto',
  },
  {
    id: 'remo',
    nombre: 'Remo',
    imagen: '/gif/cardio/Rowing-Machine-unscreen.gif',
    descripcion: 'Remo ergómetro',
  },
  {
    id: 'eliptico',
    nombre: 'Elíptico',
    imagen: '/gif/cardio/Elliptical-Machine-unscreen.gif',
    descripcion: 'Elíptica / cross trainer',
  },
  {
    id: 'escaladora',
    nombre: 'Escaladora',
    imagen: '/gif/cardio/Walking-on-Stepmill-unscreen.gif',
    descripcion: 'Stepmill / escaladora',
  },
];

export function findCardioById(id: string): OpcionCardio | undefined {
  return OPCIONES_CARDIO.find((o) => o.id === id);
}

export function findCardioByNombre(nombre: string): OpcionCardio | undefined {
  return OPCIONES_CARDIO.find(
    (o) => o.nombre.toLowerCase() === nombre.toLowerCase(),
  );
}
