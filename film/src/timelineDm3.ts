import film from './data/dm3.json';
import voice from './data/dm3.voice.json';
import {makeTimeline} from './tl';

/** «Девять минут», серия 3 «Палыч» (финал). */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
