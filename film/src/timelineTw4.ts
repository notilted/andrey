import film from './data/tw4.json';
import voice from './data/tw4.voice.json';
import {makeTimeline} from './tl';

/** «Три волны», сезон 2, серия 4 «Он тормозит». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
