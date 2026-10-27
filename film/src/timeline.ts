import film from './data/film.json';
import voice from './data/film.voice.json';
import {FPS} from './theme';

type Line = {id: string; who: string; name: string; start: number; caption: string};
const V = voice as Record<string, {duration: number; mouth: number[]}>;
const D = film.dialogue as Line[];
const MK = film.marks as Record<string, number>;

export const TL = film;
export const DURATION = Math.round(film.duration * FPS);

/** Кадр маркера таймлайна. */
export const mk = (name: string) => {
  if (MK[name] === undefined) throw new Error('нет маркера ' + name);
  return Math.round(MK[name] * FPS);
};

/** Реплика: начало и длительность в кадрах. */
export const line = (id: string) => {
  const d = D.find((x) => x.id === id);
  if (!d) throw new Error('нет реплики ' + id);
  return {start: Math.round(d.start * FPS), dur: Math.round(V[id].duration * FPS), caption: d.caption, name: d.name, who: d.who};
};

/** Открытие рта по огибающей реплики (для липсинка). */
export const mouth = (id: string, f: number) => {
  const l = line(id);
  const m = V[id].mouth[f - l.start];
  return m === undefined ? 0 : Math.min(1, m * (0.75 + 0.25 * Math.sin(f * 1.7)));
};

/** Сумма открытий рта по нескольким репликам персонажа. */
export const mouthAny = (ids: string[], f: number) => ids.reduce((a, id) => Math.max(a, mouth(id, f)), 0);

export const DIALOGUE = D;
