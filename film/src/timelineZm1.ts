import film from './data/zm1.json';
import voice from './data/zm1.voice.json';
import {makeTimeline} from './tl';

/** «Карантин», серия 1. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
