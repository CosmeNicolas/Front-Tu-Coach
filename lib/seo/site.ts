import type { Metadata } from 'next';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tucoach.pro'
).replace(/\/$/, '');

export const SITE_NAME = 'TuCoach';

export const SITE_DESCRIPTION =
  'Creá planificaciones, compartí ejercicios y seguí el progreso de tus alumnos. Para entrenadores, gimnasios y quienes entrenan por su cuenta.';

export const SITE_KEYWORDS = [
  'TuCoach',
  'planificación de entrenamiento',
  'entrenador personal',
  'seguimiento de alumnos',
  'gimnasio',
  'rutinas de entrenamiento',
  'coach deportivo',
  'entrenamiento online',
];

const OG_IMAGE = {
  url: '/branding/LGO600PX.png',
  width: 600,
  height: 600,
  alt: 'TuCoach',
};

export const PRIVATE_ROBOTS: Metadata = {
  robots: { index: false, follow: false },
};

export function publicMetadata(input: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: string | null;
  index?: boolean;
}): Metadata {
  const index = input.index !== false;
  const remoteImage = input.image?.startsWith('http') ? input.image : null;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    keywords: SITE_KEYWORDS,
    alternates: {
      canonical: input.path,
      languages: { 'es-AR': input.path },
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: SITE_NAME,
      locale: 'es_AR',
      type: 'website',
      images: remoteImage ? [{ url: remoteImage, alt: input.title }] : [OG_IMAGE],
    },
    twitter: {
      card: 'summary',
      title: input.title,
      description: input.description,
      images: remoteImage ? [remoteImage] : [OG_IMAGE.url],
    },
  };
}

export function homeJsonLd(description: string) {
  const orgId = `${SITE_URL}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/branding/LGO600PX.png`,
        email: 'apptucoach@gmail.com',
        description,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'es-AR',
        publisher: { '@id': orgId },
        description,
      },
    ],
  };
}
