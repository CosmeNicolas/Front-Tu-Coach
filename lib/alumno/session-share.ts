import { formatSessionClock, formatTrainingMinutes } from '@/lib/alumno/format-time';

export type SessionShareStats = {
  displayName: string;
  planTitle: string;
  sessionNum: number;
  totalSesiones: number;
  durationSeconds: number;
  totalVolumeKg: number;
  rpe: number | null;
};

export function buildSessionShareText(stats: SessionShareStats): string {
  const lines = [
    `¡Completé la sesión ${stats.sessionNum} en TuCoach! 💪`,
    stats.planTitle ? `Plan: ${stats.planTitle}` : null,
    stats.durationSeconds > 0
      ? `⏱ Tiempo: ${formatTrainingMinutes(stats.durationSeconds)}`
      : null,
    stats.totalVolumeKg > 0 ? `🏋 Volumen: ${stats.totalVolumeKg} kg` : null,
    stats.rpe != null ? `RPE: ${stats.rpe}/10` : null,
    '',
    'Entrená con TuCoach → https://tucoach.pro/entrenamientos',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function splitShareName(name: string): {
  primary: string;
  secondary: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { primary: (parts[0] ?? 'TuCoach').toUpperCase(), secondary: '' };
  }
  const mid = Math.ceil(parts.length / 2);
  return {
    primary: parts.slice(0, mid).join(' ').toUpperCase(),
    secondary: parts.slice(mid).join(' ').toUpperCase(),
  };
}

export function formatShareVolume(kg: number): string {
  if (kg <= 0) return '—';
  return `${Math.round(kg)} kg`;
}

export function formatShareDuration(seconds: number): string {
  if (seconds <= 0) return '—';
  return formatSessionClock(seconds);
}
