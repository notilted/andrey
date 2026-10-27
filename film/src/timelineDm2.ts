import film from './data/dm2.json';
import voice from './data/dm2.voice.json';
import {makeTimeline} from './tl';

/** «Девять минут», серия 2 «Вторая волна». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
