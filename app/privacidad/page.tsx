import type { Metadata } from 'next';
import { LegalDocument } from '@/components/landing/LegalDocument';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/landing/constants';

export const metadata: Metadata = {
  title: 'Política de privacidad — TuCoach',
  description: 'Cómo trata TuCoach los datos de la cuenta y del entrenamiento.',
};

export default function PrivacidadPage() {
  return (
    <LegalDocument title="Política de privacidad" updated="30 de agosto de 2026">
      <p>
        Esta página dice qué datos usa TuCoach para operar. Si querés borrar o
        corregir algo, escribinos a{' '}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Qué guardamos</h2>
      <p>
        Nombre, apellido, email y contraseña (hasheada). En cuentas de
        profesor: el nombre del estudio, alumnos, planificaciones, sesiones,
        métricas y mensajes del chat. En gente común: la ficha y el plan
        catálogo que se clona al registrarse.
      </p>
      <p>
        También guardamos tokens de sesión y, si pedís recuperar la clave, un
        token de reset con vencimiento de una hora.
      </p>

      <h2>Para qué</h2>
      <p>
        Solo para prestar el servicio: login, mails transaccionales (bienvenida
        y recupero de contraseña), límites de plan y el trabajo diario del
        entrenador con sus alumnos. No vendemos listas de contactos.
      </p>

      <h2>Quién procesa</h2>
      <p>
        La app corre en hosting web (hoy Netlify) y la base en MongoDB Atlas.
        Los mails salen por Resend desde hola@tucoach.pro. Si un profesor
        sube videos o fotos de ejercicios, se usa Cloudinary cuando está
        configurado.
      </p>

      <h2>Cuánto tiempo</h2>
      <p>
        Mientras la cuenta esté activa. Un alumno se puede dar de baja (soft
        delete) desde el panel del profesor. Si pedís el cierre de la cuenta,
        lo coordinamos a mano.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Podés pedir acceso, corrección o baja de tus datos escribiendo a{' '}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>. El reset de contraseña
        está en /recuperar.
      </p>
    </LegalDocument>
  );
}
