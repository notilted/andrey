import film from './data/bn3.json';
import voice from './data/bn3.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 млн», сезон 2, финал. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
