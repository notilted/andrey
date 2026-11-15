import film from './data/ns1.json';
import voice from './data/ns1.voice.json';
import {makeTimeline} from './tl';

/** «Не спать сутки». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
