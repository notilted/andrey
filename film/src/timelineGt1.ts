import film from './data/gt1.json';
import voice from './data/gt1.voice.json';
import {makeTimeline} from './tl';

/** «13 лет ждал». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
