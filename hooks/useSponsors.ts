'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSponsor,
  deleteSponsor,
  fetchAdminSponsors,
  fetchPublicSponsors,
  updateSponsor,
  uploadSponsorImage,
} from '@/lib/api/sponsors';
import {
  CreateSponsorPayload,
  UpdateSponsorPayload,
} from '@/types/sponsor';

export function usePublicSponsors() {
  return useQuery({
    queryKey: ['sponsors', 'public'],
    queryFn: fetchPublicSponsors,
  });
}

export function useAdminSponsors() {
  return useQuery({
    queryKey: ['sponsors', 'admin'],
    queryFn: fetchAdminSponsors,
  });
}

export function useCreateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSponsorPayload) => createSponsor(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
}

export function useUpdateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSponsorPayload;
    }) => updateSponsor(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
}

export function useDeleteSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSponsor(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
}

export function useUploadSponsorImage() {
  return useMutation({
    mutationFn: (file: File) => uploadSponsorImage(file),
  });
}
