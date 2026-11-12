import film from './data/bn2.json';
import voice from './data/bn2.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 млн», сезон 2, часть 2. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
