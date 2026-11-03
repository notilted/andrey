import film from './data/cr7.json';
import voice from './data/cr7.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 7. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
