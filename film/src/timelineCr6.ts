import film from './data/cr6.json';
import voice from './data/cr6.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 6. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
