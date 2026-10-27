import film from './data/dm1.json';
import voice from './data/dm1.voice.json';
import {makeTimeline} from './tl';

/** «Девять минут», серия 1 «Море ушло». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
