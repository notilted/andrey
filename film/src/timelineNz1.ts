import film from './data/nz1.json';
import voice from './data/nz1.voice.json';
import {makeTimeline} from './tl';

/** «Нет завещания». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
