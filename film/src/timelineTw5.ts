import film from './data/tw5.json';
import voice from './data/tw5.voice.json';
import {makeTimeline} from './tl';

/** «Три волны», сезон 2, серия 5 «Звонок» (финал). */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
