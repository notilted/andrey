import film from './data/zm3.json';
import voice from './data/zm3.voice.json';
import {makeTimeline} from './tl';

/** «Карантин», серия 3. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
