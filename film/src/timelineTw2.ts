import film from './data/tw2.json';
import voice from './data/tw2.voice.json';
import {makeTimeline} from './tl';

/** «Три волны», серия 2 «12 часов». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
