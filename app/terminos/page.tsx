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
        TuCoach (tucoach.pro) es una plataforma destinada a facilitar la organización,
        planificación y seguimiento del entrenamiento físico para profesores, gimnasios
        y personas que entrenan de manera independiente.
      </p>
      <p>
        Estos Términos y Condiciones regulan el acceso y uso de la plataforma. Al crear
        una cuenta o utilizar TuCoach, el usuario acepta las condiciones que se detallan
        a continuación.
      </p>
      <p>
        Ante cualquier duda, podés comunicarte con nosotros a{' '}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Cuentas</h2>
      <p>TuCoach puede utilizarse de diferentes maneras.</p>
      <p>
        Los profesores pueden registrarse y utilizar la plataforma para gestionar sus
        alumnos, crear planificaciones y realizar el seguimiento de sus entrenamientos.
      </p>
      <p>
        Las personas que quieran entrenar de manera independiente pueden acceder a planes
        generales de entrenamiento disponibles a través de TuCoach.
      </p>
      <p>
        Los gimnasios y centros de entrenamiento pueden solicitar el alta de una cuenta
        para gestionar profesores, alumnos y planificaciones dentro de su organización.
      </p>
      <p>
        Cada usuario accede a la plataforma con una cuenta personal y un rol determinado
        según el tipo de uso que realice.
      </p>
      <p>
        Cada dirección de correo electrónico puede estar asociada a una única cuenta
        dentro de TuCoach.
      </p>
      <p>
        El usuario es responsable de mantener la confidencialidad de sus datos de acceso
        y de las actividades realizadas desde su cuenta.
      </p>

      <h2>Prueba y planes</h2>
      <p>
        Los profesores que se registren en TuCoach pueden acceder inicialmente a una
        prueba gratuita de <strong>{TRIAL_DAYS} días del plan Premium</strong>.
      </p>
      <p>
        Una vez finalizado ese período, si el usuario no contrata un plan pago, su cuenta
        pasará automáticamente al plan gratuito.
      </p>
      <p>
        El plan gratuito permite actualmente gestionar hasta{' '}
        <strong>2 alumnos y 1 planificación activa</strong>.
      </p>
      <p>
        El cambio a un plan inferior no implica la eliminación inmediata de la
        información previamente cargada.
      </p>
      <p>
        TuCoach ofrece diferentes planes y modalidades de acceso según las necesidades de
        profesores, usuarios independientes y gimnasios.
      </p>
      <p>
        Los precios, características, límites y promociones vigentes se informan a
        través de <strong>tucoach.pro</strong> o mediante nuestros canales oficiales de
        contacto.
      </p>
      <p>
        En el caso de planes de entrenamiento de duración determinada, como programas de
        4, 8 o 12 semanas, el precio podrá establecerse de acuerdo con las
        características del programa solicitado.
      </p>
      <p>
        Actualmente, la contratación de determinados servicios pagos puede coordinarse
        directamente con TuCoach por correo electrónico u otros medios de contacto
        habilitados.
      </p>
      <p>
        TuCoach no realiza diagnósticos médicos ni prescribe tratamientos para patologías,
        lesiones o procesos de rehabilitación.
      </p>
      <p>
        Los profesores y demás profesionales que utilicen la plataforma podrán crear
        planificaciones adaptadas a las condiciones particulares de sus alumnos,
        incluyendo antecedentes de lesiones, patologías o procesos de recuperación,
        siempre dentro del alcance de su formación, competencias y habilitación
        profesional.
      </p>
      <p>
        Cuando corresponda, estas planificaciones deberán realizarse respetando las
        indicaciones y restricciones establecidas por profesionales de la salud.
      </p>
      <p>
        TuCoach funciona únicamente como una herramienta para crear, organizar y realizar
        el seguimiento de dichas planificaciones y no reemplaza la evaluación,
        diagnóstico, tratamiento ni supervisión de profesionales de la salud.
      </p>

      <h2>Uso de la plataforma</h2>
      <p>
        TuCoach está destinada a la gestión y organización del entrenamiento físico.
      </p>
      <p>
        Los profesores pueden utilizar la plataforma para crear planificaciones, asignar
        ejercicios, registrar información relacionada con el entrenamiento y realizar el
        seguimiento de sus alumnos.
      </p>
      <p>
        Los gimnasios pueden utilizar TuCoach para organizar el trabajo de sus profesores
        y alumnos dentro de la plataforma.
      </p>
      <p>
        Los usuarios independientes pueden acceder a programas generales de entrenamiento
        sin necesidad de contratar a un profesor.
      </p>
      <p>
        El usuario se compromete a utilizar TuCoach de forma responsable y únicamente
        para fines relacionados con las funcionalidades ofrecidas por la plataforma.
      </p>
      <p>
        No está permitido utilizar TuCoach para actividades ilegales, fraudulentas,
        abusivas o que puedan afectar el funcionamiento de la plataforma o perjudicar a
        otros usuarios.
      </p>

      <h2>Entrenamiento y salud</h2>
      <p>
        TuCoach es una herramienta tecnológica destinada a facilitar la organización y
        seguimiento del entrenamiento.
      </p>
      <p>
        <strong>
          TuCoach no constituye un servicio médico ni reemplaza la evaluación,
          diagnóstico, tratamiento o asesoramiento de profesionales de la salud.
        </strong>
      </p>
      <p>
        Los programas disponibles para usuarios que entrenan de manera independiente
        consisten en propuestas generales de entrenamiento.
      </p>
      <p>
        Estas planificaciones pueden incluir ejercicios, series, repeticiones, cargas
        estimadas, tiempos de descanso u otros parámetros relacionados con el
        entrenamiento.
      </p>
      <p>
        La información incluida en estos programas tiene carácter orientativo y no
        representa una evaluación individual ni una prescripción médica.
      </p>
      <p>
        Cada usuario debe considerar su estado físico y sus condiciones personales antes
        de realizar actividad física.
      </p>
      <p>
        Ante lesiones, enfermedades, dolor, molestias importantes o cualquier situación
        que pueda afectar la práctica segura de ejercicio, recomendamos consultar
        previamente con un profesional de la salud.
      </p>

      <h2>Profesores y profesionales</h2>
      <p>
        TuCoach proporciona herramientas para que profesores y profesionales puedan
        organizar y gestionar el entrenamiento de sus alumnos.
      </p>
      <p>
        Cuando una planificación es creada o modificada por un profesor, dicho profesional
        es responsable del contenido de esa planificación y de evaluar si resulta adecuada
        para su alumno.
      </p>
      <p>
        TuCoach no supervisa de manera presencial la ejecución de los ejercicios ni
        reemplaza el criterio profesional del entrenador.
      </p>
      <p>
        Cada profesor es responsable de utilizar la plataforma dentro de los límites de
        su formación, experiencia y habilitación profesional cuando corresponda.
      </p>

      <h2>Usuarios independientes</h2>
      <p>
        Las personas que utilicen TuCoach sin un profesor pueden acceder a programas
        generales de entrenamiento disponibles dentro de la plataforma.
      </p>
      <p>
        Estos programas están diseñados como referencias generales y no tienen en cuenta
        necesariamente las condiciones particulares de cada persona.
      </p>
      <p>
        El usuario independiente es responsable de seleccionar entrenamientos adecuados
        para su nivel de experiencia y condición física.
      </p>
      <p>
        TuCoach no puede garantizar resultados específicos derivados de la realización de
        un programa de entrenamiento.
      </p>

      <h2>Información y datos del usuario</h2>
      <p>
        Los usuarios conservan la titularidad sobre la información que cargan en TuCoach.
      </p>
      <p>
        Cuando un alumno se encuentra vinculado con un profesor o gimnasio, determinada
        información relacionada con su entrenamiento podrá ser consultada por los
        profesionales autorizados encargados de su seguimiento.
      </p>
      <p>Esto puede incluir, entre otros datos:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>planificaciones;</li>
        <li>sesiones realizadas;</li>
        <li>ejercicios;</li>
        <li>cargas;</li>
        <li>repeticiones;</li>
        <li>comentarios;</li>
        <li>percepción de esfuerzo;</li>
        <li>progreso de entrenamiento.</li>
      </ul>
      <p>
        TuCoach utiliza esta información únicamente para permitir el funcionamiento de las
        herramientas y servicios ofrecidos dentro de la plataforma.
      </p>
      <p>
        El tratamiento de los datos personales se realizará de acuerdo con la{' '}
        <a href="/privacidad">Política de Privacidad</a> de TuCoach.
      </p>

      <h2>Disponibilidad del servicio</h2>
      <p>
        Trabajamos para mantener TuCoach disponible y funcionando correctamente.
      </p>
      <p>
        Sin embargo, pueden producirse interrupciones temporales por mantenimiento,
        actualizaciones, problemas técnicos, servicios externos o situaciones fuera de
        nuestro control.
      </p>
      <p>
        Por este motivo, no podemos garantizar que la plataforma se encuentre disponible
        de manera permanente o completamente libre de errores.
      </p>
      <p>
        TuCoach podrá incorporar, modificar o eliminar funcionalidades con el objetivo de
        mejorar el servicio.
      </p>
      <p>
        Cuando una modificación afecte de manera significativa las condiciones de uso del
        servicio, procuraremos informarlo a los usuarios.
      </p>

      <h2>Suspensión de cuentas</h2>
      <p>
        TuCoach podrá suspender temporalmente o limitar el acceso a una cuenta cuando
        exista:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>uso indebido de la plataforma;</li>
        <li>incumplimiento de estos términos;</li>
        <li>falta de pago de un servicio contratado;</li>
        <li>actividad que pueda afectar a otros usuarios;</li>
        <li>riesgos para la seguridad de la plataforma;</li>
        <li>utilización fraudulenta o ilegal del servicio.</li>
      </ul>
      <p>
        La suspensión del acceso no implica necesariamente la eliminación inmediata de la
        información almacenada.
      </p>
      <p>
        Siempre que sea razonablemente posible, intentaremos informar al usuario sobre la
        situación y las alternativas disponibles para regularizar su cuenta.
      </p>

      <h2>Cancelación</h2>
      <p>El usuario puede dejar de utilizar TuCoach cuando lo desee.</p>
      <p>
        En caso de solicitar el cierre de una cuenta, TuCoach podrá conservar determinada
        información durante el tiempo necesario para cumplir obligaciones legales,
        administrativas, de seguridad o relacionadas con la prestación del servicio.
      </p>
      <p>
        La eliminación de información estará sujeta a las condiciones establecidas en
        nuestra <a href="/privacidad">Política de Privacidad</a>.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        La marca TuCoach, el diseño de la plataforma, sus interfaces, software, identidad
        visual, contenidos propios y demás elementos desarrollados por TuCoach están
        protegidos por las normas aplicables de propiedad intelectual.
      </p>
      <p>
        El uso de la plataforma no otorga al usuario derechos de propiedad sobre estos
        elementos.
      </p>
      <p>
        Los profesores, gimnasios y usuarios conservan los derechos que les correspondan
        sobre los contenidos propios que incorporen a la plataforma.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        TuCoach proporciona una herramienta para facilitar la planificación y gestión del
        entrenamiento.
      </p>
      <p>
        No garantizamos resultados físicos, deportivos o de rendimiento específicos
        derivados del uso de la plataforma.
      </p>
      <p>
        La efectividad de un programa de entrenamiento depende de numerosos factores,
        incluyendo la condición física de cada persona, alimentación, descanso,
        constancia, correcta ejecución de los ejercicios y seguimiento profesional.
      </p>
      <p>
        Los profesores son responsables de las planificaciones que crean y asignan a sus
        alumnos.
      </p>
      <p>
        Los usuarios independientes son responsables de evaluar si los entrenamientos
        seleccionados son adecuados para sus condiciones personales.
      </p>
      <p>
        Nada de lo establecido en estos términos busca limitar los derechos que
        correspondan a los usuarios conforme a la legislación aplicable.
      </p>

      <h2>Cambios en estos términos</h2>
      <p>
        TuCoach podrá actualizar estos Términos y Condiciones cuando sea necesario debido
        a cambios en el servicio, nuevas funcionalidades, modificaciones comerciales o
        requisitos legales.
      </p>
      <p>
        La fecha de la última actualización estará indicada al inicio de este documento.
      </p>
      <p>
        Cuando los cambios sean relevantes para los usuarios, podremos comunicarlos a
        través de la plataforma, correo electrónico u otros canales disponibles.
      </p>

      <h2>Contacto</h2>
      <p>
        Para consultas relacionadas con cuentas, planes, funcionamiento de la plataforma
        o cuestiones comerciales podés comunicarte con:
      </p>
      <p>
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
      </p>
      <p>También podés encontrar más información sobre TuCoach en:</p>
      <p>
        <a href="https://tucoach.pro">tucoach.pro</a>
      </p>
    </LegalDocument>
  );
}
