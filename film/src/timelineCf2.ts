import film from './data/cf2.json';
import voice from './data/cf2.voice.json';
import {makeTimeline} from './tl';

/** «Чужой телефон», часть 2. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
