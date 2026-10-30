import film from './data/cr3.json';
import voice from './data/cr3.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 3. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
