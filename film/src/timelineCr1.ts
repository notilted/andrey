import film from './data/cr1.json';
import voice from './data/cr1.voice.json';
import {makeTimeline} from './tl';

/** «Из низов», серия 1. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
