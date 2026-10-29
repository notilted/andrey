import film from './data/cr2.json';
import voice from './data/cr2.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 2. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
