import type { MetadataRoute } from 'next';
import { fetchPublicProfessors } from '@/lib/api/professor-catalog';
import { fetchPublicStandardPlans } from '@/lib/api/standard-plans';
import { SITE_URL } from '@/lib/seo/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/profesores`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/entrenamientos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const [professors, plans] = await Promise.all([
    fetchPublicProfessors().catch(() => null),
    fetchPublicStandardPlans().catch(() => null),
  ]);

  const professorPages: MetadataRoute.Sitemap = (professors?.items ?? []).map(
    (professor) => ({
      url: `${SITE_URL}/profesores/${professor.slug}`,
      lastModified: professor.publishedAt
        ? new Date(professor.publishedAt)
        : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }),
  );

  const planPages: MetadataRoute.Sitemap = (plans?.items ?? []).map((plan) => ({
    url: `${SITE_URL}/entrenamientos/${plan.slug}`,
    lastModified: plan.publishedAt ? new Date(plan.publishedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...professorPages, ...planPages];
}
