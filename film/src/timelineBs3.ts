import film from './data/bs3.json';
import voice from './data/bs3.voice.json';
import {makeTimeline} from './tl';

/** «Без сигнала», часть 3. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
