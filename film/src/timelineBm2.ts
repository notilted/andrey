import film from './data/bm2.json';
import voice from './data/bm2.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 миллиона», серия 2 «Минус». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
