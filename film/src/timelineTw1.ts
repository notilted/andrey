import film from './data/tw1.json';
import voice from './data/tw1.voice.json';
import {makeTimeline} from './tl';

/** «Три волны», серия 1 «2 минуты». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
