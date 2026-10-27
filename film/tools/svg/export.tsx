// Экспорт векторных иллюстраций в отдельные SVG: node tools/svg/run.mjs
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import {Character, Who} from '../../src/components/Character';
import {FarSkyline, MidTowers, Sky, Street} from '../../src/components/City';
import {PanelBuilding, BLD} from '../../src/components/PanelBuilding';
import {ApartmentBack, ApartmentFront, Chair} from '../../src/components/Apartment';
import {BuildingSection} from '../../src/components/Section';
import {Cage, ChessCloseup, ShelterBack, ShelterFront} from '../../src/components/Shelter';
import {C} from '../../src/theme';

const out = path.resolve(process.argv[2] ?? '../output/svg');
fs.mkdirSync(out, {recursive: true});
const save = (name: string, w: number, h: number, el: React.ReactElement, vb = `0 0 ${w} ${h}`) => {
  const svg = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox={vb} width={w} height={h}>{el}</svg>);
  fs.writeFileSync(path.join(out, name + '.svg'), svg);
  console.log(name);
};
const whos: Who[] = ['mark', 'alisa', 'galina', 'lev'];
for (const w of whos) {
  save(`character_${w}`, 400, 520, <Character who={w} x={200} y={500} size={w === 'alisa' ? 1.35 : 1.25} />);
  save(`character_${w}_sitting`, 400, 420, <Character who={w} x={170} y={400} size={1.2} pose={{sit: 1, armF: [62, -58]}} />);
}
save('city_night', 1080, 1920, <g><Sky f={0} /><FarSkyline f={0} base={1180} /><MidTowers f={0} base={1250} /><PanelBuilding f={0} special={{'4,1': 'tv', '5,4': 'kettle', '6,3': 'mark'}} /><Street f={0} y={BLD.top + BLD.rows * BLD.rowH} /></g>);
save('apartment_mark', 1080, 1920, <g><ApartmentBack f={0} /><Chair x={220} facing={1} /><Chair x={830} facing={-1} /><ApartmentFront f={0} /></g>);
save('stairwell_section', 1080, 1920, <BuildingSection f={0} />);
const light = {lamps: 1, red: 0, monitor: 0};
save('shelter_17', 1600, 1300, <g transform="translate(260 -60)"><ShelterBack f={0} light={light} /><ShelterFront f={0} light={light} /></g>);
save('shelter_17_red', 1600, 1300, <g transform="translate(260 -60)"><ShelterBack f={0} light={{lamps: 0, red: 1, monitor: 0}} /><ShelterFront f={0} light={{lamps: 0, red: 1, monitor: 0}} monitorOn={1} /></g>);
save('chess_closeup', 1080, 1300, <ChessCloseup f={0} moveT={0.5} />);
save('parrot_cage', 240, 320, <g><rect width={240} height={320} fill={C.bg} /><Cage x={120} y={300} f={0} s={1.5} /></g>);
