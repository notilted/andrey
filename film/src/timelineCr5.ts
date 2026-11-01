import film from './data/cr5.json';
import voice from './data/cr5.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 5. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
