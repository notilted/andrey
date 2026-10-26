import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string][] = [
  ['Montserrat', '600', 'montserrat-cyrillic-600-normal.woff2'],
  ['Montserrat', '700', 'montserrat-cyrillic-700-normal.woff2'],
  ['Montserrat', '800', 'montserrat-cyrillic-800-normal.woff2'],
  ['Montserrat', '900', 'montserrat-cyrillic-900-normal.woff2'],
  ['Montserrat', '600', 'montserrat-latin-600-normal.woff2'],
  ['Montserrat', '700', 'montserrat-latin-700-normal.woff2'],
  ['Montserrat', '800', 'montserrat-latin-800-normal.woff2'],
  ['Montserrat', '900', 'montserrat-latin-900-normal.woff2'],
  ['JetBrains Mono', '700', 'jetbrains-mono-cyrillic-700-normal.woff2'],
  ['JetBrains Mono', '800', 'jetbrains-mono-cyrillic-800-normal.woff2'],
  ['JetBrains Mono', '700', 'jetbrains-mono-latin-700-normal.woff2'],
  ['JetBrains Mono', '800', 'jetbrains-mono-latin-800-normal.woff2'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(([family, weight, file]) => {
      const f = new FontFace(family, `url(${staticFile('fonts/' + file)})`, {weight});
      document.fonts.add(f);
      return f.load();
    }),
  ).then(() => continueRender(handle));
}
