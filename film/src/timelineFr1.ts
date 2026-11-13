import film from './data/fr1.json';
import voice from './data/fr1.voice.json';
import {makeTimeline} from './tl';

/** «Пятница 13». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
