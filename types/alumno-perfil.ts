export interface StudentPersonalData {
  edad: number | null;
  peso: number | null;
  altura: number | null;
  objetivo: string | null;
  condicionanteDeCarga: string | null;
}

export interface StudentProfesorBrief {
  nombre: string | null;
  email: string | null;
}

export interface StudentPerfil {
  email: string;
  nombre: string;
  apellido: string;
  clienteEmail: string | null;
  datos: StudentPersonalData;
  profesor: StudentProfesorBrief | null;
  /** true cuando el profesor asignado es el mismo usuario y no hay coach aceptado. */
  entrenandoSolo?: boolean;
}
