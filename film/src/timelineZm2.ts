import film from './data/zm2.json';
import voice from './data/zm2.voice.json';
import {makeTimeline} from './tl';

/** «Карантин», серия 2. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
