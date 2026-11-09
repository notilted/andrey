import film from './data/gm.json';
import voice from './data/gm.voice.json';
import {makeTimeline} from './tl';

/** шпаргалка «Четырёхугольники». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
