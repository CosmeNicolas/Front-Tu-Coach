import type { Metadata } from 'next';
import { LegalDocument } from '@/components/landing/LegalDocument';
import { CONTACT_EMAIL, CONTACT_MAILTO, TRIAL_DAYS } from '@/lib/landing/constants';

export const metadata: Metadata = {
  title: 'Términos y condiciones — TuCoach',
  description: 'Condiciones de uso de TuCoach.',
};

export default function TerminosPage() {
  return (
    <LegalDocument title="Términos y condiciones" updated="30 de agosto de 2026">
      <p>
        TuCoach (tucoach.pro) es una plataforma para que entrenadores armen
        planificaciones, carguen alumnos y sigan el progreso. Estos términos
        describen cómo se usa el servicio hoy. No son un contrato de abogados
        de estudio: si algo no está claro, escribinos a{' '}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Cuentas</h2>
      <p>
        Hay tres caminos. Un profesor se registra solo y opera su estudio. Una
        persona puede pedirnos un plan estándar para entrenar sin profesor. Un
        gimnasio se da de alta con nosotros (concierge): todavía no hay signup
        self-serve de gym.
      </p>
      <p>
        Cada cuenta vive en un tenant. Un usuario tiene un solo rol (profesor,
        alumno, owner o super admin). El email es único en toda la plataforma.
      </p>

      <h2>Prueba y planes</h2>
      <p>
        El registro de profesor empieza con {TRIAL_DAYS} días de prueba
        Premium. Si no hay un pago acordado cuando vence, la cuenta pasa a
        Free: hasta 2 alumnos y 1 planificación activa en toda la cuenta. No
        borramos los datos al bajar de plan.
      </p>
      <p>
        Premium, Pro, Plus y Gimnasios tienen precio de lista en la landing
        (pesos, por mes, con 60% off el primer mes). Los bloques de
        entrenamiento (4, 8 o 12 semanas, o personalizada) se cotizan por
        bloque. Todavía no hay cobro automático ni factura electrónica adentro
        del producto: el alta paga se coordina por mail. No ofrecemos planes
        por patología, lesión ni rehabilitación.
      </p>

      <h2>Uso aceptable</h2>
      <p>
      La plataforma está destinada a la gestión y organización del entrenamiento físico. No constituye un servicio médico ni sustituye el asesoramiento de profesionales de la salud.

Los planes disponibles en el catálogo para usuarios independientes consisten en plantillas generales de entrenamiento, que pueden incluir cargas, repeticiones y otros parámetros sugeridos. Estas recomendaciones son orientativas y no constituyen una evaluación, prescripción personalizada ni diagnóstico profesional.
      </p>
      <p>
        Podemos suspender una cuenta si hay abuso, impago acordado o riesgo
        para otros usuarios. Suspender corta el acceso; no implica borrar el
        historial de inmediato.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        El producto se ofrece “tal como está”. Nos esforzamos por que funcione,
        pero no prometemos disponibilidad continua ni resultados de
        entrenamiento. El profesor es responsable de lo que prescribe a sus
        alumnos.
      </p>

      <h2>Contacto</h2>
      <p>
        Dudas comerciales o de cuenta:{' '}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalDocument>
  );
}
