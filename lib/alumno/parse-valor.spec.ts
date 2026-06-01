import { TipoItem, UnidadTrabajo } from '@/types/planification';
import { parseExerciseParams } from './parse-valor';

describe('parseExerciseParams', () => {
  it('isométrico: series × segundos, sin reps', () => {
    const r = parseExerciseParams(
      "3x30''",
      TipoItem.ISOMETRICO,
      UnidadTrabajo.SEG,
    );
    expect(r.series).toBe('3');
    expect(r.segundos).toBe('30');
    expect(r.reps).toBeNull();
  });

  it('fuerza: series × reps con peso', () => {
    const r = parseExerciseParams(
      '20kg 3x8',
      TipoItem.FUERZA,
      UnidadTrabajo.REPS,
    );
    expect(r.pesoKg).toBe('20');
    expect(r.series).toBe('3');
    expect(r.reps).toBe('8');
    expect(r.segundos).toBeNull();
  });

  it('no confunde isométrico 3x30 con reps', () => {
    const r = parseExerciseParams(
      "3x35''",
      TipoItem.ISOMETRICO,
      UnidadTrabajo.SEG,
      { series: 3, segundos: 35 },
    );
    expect(r.reps).toBeNull();
    expect(r.segundos).toBe('35');
  });
});
