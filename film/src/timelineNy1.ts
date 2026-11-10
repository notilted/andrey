import film from './data/ny1.json';
import voice from './data/ny1.voice.json';
import {makeTimeline} from './tl';

/** «11 дней каникул». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
