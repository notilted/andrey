import film from './data/film.json';
import voice from './data/film.voice.json';
import {makeTimeline} from './tl';

/** Часть 1 «17 минут». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
