import film from './data/ep2.json';
import voice from './data/ep2.voice.json';
import {makeTimeline} from './tl';

/** Часть 2 «Этап второй». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
