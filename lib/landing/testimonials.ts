export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
  organization?: string;
  rating?: number;
  /** Ruta a imagen en /public cuando exista */
  avatarSrc?: string;
}

/**
 * Testimonios reales — agregar aquí cuando estén disponibles.
 * Mientras el array esté vacío, la sección muestra placeholders demostrativos.
 */
export const LANDING_TESTIMONIALS: LandingTestimonial[] = [];
