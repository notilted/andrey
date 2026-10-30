import film from './data/cr4.json';
import voice from './data/cr4.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 4. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
