import film from './data/bm3.json';
import voice from './data/bm3.voice.json';
import {makeTimeline} from './tl';

/** «Бабушкины 2 миллиона», серия 3 «Тетрадь» (финал). */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
