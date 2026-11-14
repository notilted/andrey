import film from './data/lf1.json';
import voice from './data/lf1.voice.json';
import {makeTimeline} from './tl';

/** «Застрял в лифте». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
