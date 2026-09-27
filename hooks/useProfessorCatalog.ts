'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminBackfillProfessorCatalog,
  adminHideProfessorCatalog,
  adminUnhideProfessorCatalog,
  fetchMyPublicProfile,
  fetchPublicProfessor,
  fetchPublicProfessors,
  publishMyPublicProfile,
  unpublishMyPublicProfile,
  updateMyPublicProfile,
  uploadProfessorFoto,
  type UpdateProfessorPublicProfilePayload,
} from '@/lib/api/professor-catalog';

export function useMyPublicProfile() {
  return useQuery({
    queryKey: ['profesor', 'perfil-publico'],
    queryFn: fetchMyPublicProfile,
  });
}

export function useUpdateMyPublicProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfessorPublicProfilePayload) =>
      updateMyPublicProfile(payload),
    onSuccess: (data) => {
      qc.setQueryData(['profesor', 'perfil-publico'], data);
    },
  });
}

export function useUploadProfessorFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadProfessorFoto,
    onSuccess: (data) => {
      qc.setQueryData(['profesor', 'perfil-publico'], data);
    },
  });
}

export function usePublishMyPublicProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: publishMyPublicProfile,
    onSuccess: (data) => {
      qc.setQueryData(['profesor', 'perfil-publico'], data);
    },
  });
}

export function useUnpublishMyPublicProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unpublishMyPublicProfile,
    onSuccess: (data) => {
      qc.setQueryData(['profesor', 'perfil-publico'], data);
    },
  });
}

export function useAdminHideProfessorCatalog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminHideProfessorCatalog,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'profesores'] });
    },
  });
}

export function useAdminUnhideProfessorCatalog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminUnhideProfessorCatalog,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'profesores'] });
    },
  });
}

export function useAdminBackfillProfessorCatalog() {
  return useMutation({
    mutationFn: adminBackfillProfessorCatalog,
  });
}

export function usePublicProfessors() {
  return useQuery({
    queryKey: ['public-professors'],
    queryFn: fetchPublicProfessors,
  });
}

export function usePublicProfessor(slug: string) {
  return useQuery({
    queryKey: ['public-professors', slug],
    queryFn: () => fetchPublicProfessor(slug),
    enabled: Boolean(slug),
  });
}
