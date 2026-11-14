import film from './data/cf1.json';
import voice from './data/cf1.voice.json';
import {makeTimeline} from './tl';

/** «Чужой телефон», часть 1. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
