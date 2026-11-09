import film from './data/bs2.json';
import voice from './data/bs2.voice.json';
import {makeTimeline} from './tl';

/** «Без сигнала», часть 2. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
