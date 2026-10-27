import {FPS} from './theme';

type Line = {id: string; who: string; name: string; start: number; caption: string};
type Film = {duration: number; dialogue: Line[]; marks: Record<string, number>; beats?: Record<string, {start: number; dur: number}>};
type Voice = Record<string, {duration: number; mouth: number[]}>;

/** Таймлайн серии: маркеры, реплики и липсинк по данным tools/timeline*.py и tools/mix.py. */
export const makeTimeline = (film: Film, voice: Voice) => {
  const mk = (name: string) => {
    if (film.marks[name] === undefined) throw new Error('нет маркера ' + name);
    return Math.round(film.marks[name] * FPS);
  };
  const line = (id: string) => {
    const d = film.dialogue.find((x) => x.id === id);
    if (!d) {
      // формат рассказчика: моменты действия персонажей заданы «битами» без собственного голоса
      const b = film.beats?.[id];
      if (!b) throw new Error('нет реплики ' + id);
      return {start: Math.round(b.start * FPS), dur: Math.round(b.dur * FPS), caption: '', name: '', who: ''};
    }
    return {start: Math.round(d.start * FPS), dur: Math.round(voice[id].duration * FPS), caption: d.caption, name: d.name, who: d.who};
  };
  const mouth = (id: string, f: number) => {
    if (!voice[id]) return 0; // говорит рассказчик — губы персонажа не двигаются
    const l = line(id);
    const m = voice[id].mouth[f - l.start];
    return m === undefined ? 0 : Math.min(1, m * (0.75 + 0.25 * Math.sin(f * 1.7)));
  };
  const mouthAny = (ids: string[], f: number) => ids.reduce((a, id) => Math.max(a, mouth(id, f)), 0);
  return {TL: film, DURATION: Math.round(film.duration * FPS), DIALOGUE: film.dialogue, mk, line, mouth, mouthAny};
};
