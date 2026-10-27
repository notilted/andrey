import {interpolate} from 'remotion';
import {mk} from './timeline';

/**
 * Таймеры «до удара». В первой сцене время идёт в реальном темпе, дальше — монтажные
 * скачки между сценами. Таймер Льва идёт медленнее (сюжетная деталь сцены 3).
 */
export const timerMark = (f: number) => {
  const A = mk('alert');
  if (f < A) return 17 * 60;
  const k: [number, number][] = [
    [A, 1020], [mk('s2'), 1020 - (mk('s2') - A) / 30], [mk('s2') + 1, 850], [mk('s3'), 640],
    [mk('s3_phones'), 540], [mk('s4'), 470], [mk('s5'), 300], [mk('s6'), 130], [mk('s7_stage'), 0],
  ];
  return interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), {extrapolateRight: 'clamp'});
};

export const timerLev = (f: number) => {
  const P = mk('s3_phones');
  if (f < P) return 720 + (P - f) / 30 * 0.6;
  return Math.max(0, 720 - ((f - P) / 30) * 0.6 - Math.max(0, f - mk('s4')) / 30 * 2.5);
};
