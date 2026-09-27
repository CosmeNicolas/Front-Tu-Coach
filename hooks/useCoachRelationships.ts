'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptCoachRelationship,
  cancelCoachRelationship,
  endCoachRelationship,
  fetchCoachChat,
  fetchCoachHistory,
  fetchCoachHistoryMaterialized,
  fetchCoachRelationshipStatus,
  fetchMyCoachRelationships,
  fetchProfessorCoachInbox,
  markCoachChatRead,
  rejectCoachRelationship,
  requestCoachRelationship,
  sendCoachChatMessage,
  setChatPermission,
  setViewHistoryPermission,
} from '@/lib/api/coach-relationships';

const KEY = ['coach-relationships'] as const;

export function useMyCoachRelationships() {
  return useQuery({
    queryKey: [...KEY, 'mine'],
    queryFn: fetchMyCoachRelationships,
  });
}

export function useCoachRelationshipStatus(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, 'status', slug],
    queryFn: () => fetchCoachRelationshipStatus(slug),
    enabled: enabled && Boolean(slug),
  });
}

export function useProfessorCoachInbox(status?: string) {
  return useQuery({
    queryKey: [...KEY, 'inbox', status ?? 'all'],
    queryFn: () => fetchProfessorCoachInbox(status),
  });
}

export function useRequestCoachRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requestCoachRelationship,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useAcceptCoachRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptCoachRelationship,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRejectCoachRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectCoachRelationship,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCancelCoachRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelCoachRelationship,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useEndCoachRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endCoachRelationship,
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useSetViewHistoryPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      viewHistory,
    }: {
      id: string;
      viewHistory: boolean;
    }) => setViewHistoryPermission(id, viewHistory),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useSetChatPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, chat }: { id: string; chat: boolean }) =>
      setChatPermission(id, chat),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCoachHistory(relationshipId: string) {
  return useQuery({
    queryKey: [...KEY, 'history', relationshipId],
    queryFn: () => fetchCoachHistory(relationshipId),
    enabled: Boolean(relationshipId),
  });
}

export function useCoachHistoryMaterialized(
  relationshipId: string,
  planificationId: string,
) {
  return useQuery({
    queryKey: [...KEY, 'history', relationshipId, planificationId],
    queryFn: () =>
      fetchCoachHistoryMaterialized(relationshipId, planificationId),
    enabled: Boolean(relationshipId && planificationId),
  });
}

export function useCoachChat(relationshipId: string) {
  return useQuery({
    queryKey: [...KEY, 'chat', relationshipId],
    queryFn: () => fetchCoachChat(relationshipId),
    enabled: Boolean(relationshipId),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
}

export function useSendCoachChatMessage(relationshipId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => sendCoachChatMessage(relationshipId, text),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: [...KEY, 'chat', relationshipId] }),
  });
}

export function useMarkCoachChatRead(relationshipId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markCoachChatRead(relationshipId),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: [...KEY, 'chat', relationshipId] }),
  });
}
