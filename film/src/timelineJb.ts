import film from './data/jb.json';
import voice from './data/jb.voice.json';
import {makeTimeline} from './tl';

/** «Ты — Джордан Белфорт». */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
