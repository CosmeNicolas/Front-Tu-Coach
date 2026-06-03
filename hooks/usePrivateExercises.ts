'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPrivateExercise,
  deletePrivateExercise,
  fetchPrivateExerciseWizardCatalog,
  fetchPrivateExercises,
  QueryPrivateExercisesParams,
  updatePrivateExercise,
  uploadPrivateExerciseMedia,
} from '@/lib/api/private-exercises';
import {
  CreatePrivateExercisePayload,
  UpdatePrivateExercisePayload,
} from '@/types/private-exercise';

export function usePrivateExercises(params?: QueryPrivateExercisesParams) {
  return useQuery({
    queryKey: ['private-exercises', params ?? {}],
    queryFn: () => fetchPrivateExercises(params),
  });
}

export function usePrivateExerciseWizardCatalog() {
  return useQuery({
    queryKey: ['private-exercises', 'wizard'],
    queryFn: fetchPrivateExerciseWizardCatalog,
    staleTime: 60_000,
  });
}

export function useCreatePrivateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePrivateExercisePayload) =>
      createPrivateExercise(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['private-exercises'] });
    },
  });
}

export function useUpdatePrivateExercise(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePrivateExercisePayload) =>
      updatePrivateExercise(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['private-exercises'] });
    },
  });
}

export function useDeletePrivateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrivateExercise(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['private-exercises'] });
    },
  });
}

export function useUploadPrivateExerciseMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      ejercicioId,
    }: {
      file: File;
      ejercicioId?: string;
    }) => uploadPrivateExerciseMedia(file, ejercicioId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['private-exercises'] });
    },
  });
}
