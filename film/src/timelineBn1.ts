import film from './data/bn1.json';
import voice from './data/bn1.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 млн», сезон 2, часть 1. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
