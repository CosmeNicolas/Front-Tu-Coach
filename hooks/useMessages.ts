'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMessageThreads,
  fetchMessagesUnreadCount,
  fetchMyMessageThread,
  fetchThreadWithAlumno,
  markThreadRead,
  sendThreadMessage,
} from '@/lib/api/messages';

export function useMessageThreads(enabled = true) {
  return useQuery({
    queryKey: ['messages', 'threads'],
    queryFn: fetchMessageThreads,
    enabled,
    refetchInterval: 12_000,
  });
}

export function useMessagesUnreadCount(enabled = true) {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: fetchMessagesUnreadCount,
    enabled,
    refetchInterval: 12_000,
  });
}

export function useMyMessageThread(enabled = true) {
  return useQuery({
    queryKey: ['messages', 'my-thread'],
    queryFn: fetchMyMessageThread,
    enabled,
    refetchInterval: 12_000,
  });
}

export function useThreadWithAlumno(alumnoId: string) {
  return useQuery({
    queryKey: ['messages', 'with-alumno', alumnoId],
    queryFn: () => fetchThreadWithAlumno(alumnoId),
    enabled: Boolean(alumnoId),
    refetchInterval: 12_000,
  });
}

export function useMarkThreadRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (threadKey: string) => markThreadRead(threadKey),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['messages'] });
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useSendThreadMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadKey, text }: { threadKey: string; text: string }) =>
      sendThreadMessage(threadKey, text),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
