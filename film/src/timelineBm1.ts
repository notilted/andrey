import film from './data/bm1.json';
import voice from './data/bm1.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 миллиона», серия 1 «Наследство». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
