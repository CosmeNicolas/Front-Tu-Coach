export type NotificationType =
  | 'plan_completed'
  | 'new_plan_request'
  | 'session_comment'
  | 'new_message'
  | 'new_alumno'
  | 'training_reminder'
  | 'alumno_training_inactive';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  alumnoId: string | null;
  alumnoNombre: string | null;
  planificationId: string | null;
  planificationTitulo: string | null;
  sessionNum: number | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
}
