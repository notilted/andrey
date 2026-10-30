import film from './data/bn.json';
import voice from './data/bn.voice.json';
import {makeTimeline} from './tl';

/** Новость: взлом Binance. */
export const {TL, DURATION, DIALOGUE, mk, line, mouth, mouthAny} = makeTimeline(film, voice);
