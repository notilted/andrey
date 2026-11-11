import film from './data/sl1.json';
import voice from './data/sl1.voice.json';
import {makeTimeline} from './tl';

/** «5 приёмов распродаж». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
