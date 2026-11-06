import film from './data/bs1.json';
import voice from './data/bs1.voice.json';
import {makeTimeline} from './tl';

/** «Без сигнала», часть 1. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
