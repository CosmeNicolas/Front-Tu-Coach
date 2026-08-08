export type MessageSenderRole = 'alumno' | 'profesor';

export interface ChatMessage {
  id: string;
  threadKey: string;
  senderRole: MessageSenderRole;
  senderUserId: string;
  text: string;
  readAtProfesor: string | null;
  readAtAlumno: string | null;
  createdAt: string;
}

export interface MessageThread {
  threadKey: string;
  alumnoId: string;
  alumnoNombre: string;
  profesorNombre: string | null;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string | null;
}

export interface ThreadDetail {
  threadKey: string;
  alumnoId: string;
  alumnoNombre: string;
  profesorNombre: string | null;
  messages: ChatMessage[];
  unreadCount: number;
}
