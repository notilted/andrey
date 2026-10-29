import film from './data/el.json';
import voice from './data/el.voice.json';
import {makeTimeline} from './tl';

/** «Последняя электричка». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
