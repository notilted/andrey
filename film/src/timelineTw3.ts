import film from './data/tw3.json';
import voice from './data/tw3.voice.json';
import {makeTimeline} from './tl';

/** «Три волны», серия 3 «2 дня». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
