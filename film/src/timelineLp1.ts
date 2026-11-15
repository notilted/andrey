import film from './data/lp1.json';
import voice from './data/lp1.voice.json';
import {makeTimeline} from './tl';

/** «Потерял телефон». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
