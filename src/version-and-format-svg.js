import {
  defaultDarkColor,
  formatPatternDarkColor,
  formatPatternLightColor,
  versionPatternDarkColor,
  versionPatternLightColor,
} from './colors';
import { ELEMENTS } from './elements';

//#region common

function paintModule(svg, bit, x, y, index, lightColor, darkColor) {
  // background
  const module = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  module.setAttribute('x', x);
  module.setAttribute('y', y);
  module.setAttribute('width', '1');
  module.setAttribute('height', '1');
  module.setAttribute('stroke-width', '0');
  module.setAttribute('fill', bit === '0' ? lightColor : darkColor);
  svg.append(module);

  // bit value
  const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  value.setAttribute('x', x + 0.3);
  value.setAttribute('y', y + 0.7);
  value.setAttribute('fill', bit === '0' ? darkColor : lightColor);
  value.textContent = bit;
  value.setAttribute('font-size', '0.6');
  svg.append(value);

  // position
  const order = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  order.setAttribute('x', x + 0.95);
  order.setAttribute('y', y + 0.9);
  order.setAttribute('fill', '#000');
  order.textContent = `(${index + 1})`;
  order.setAttribute('font-size', '0.2');
  order.setAttribute('text-anchor', 'end');
  svg.append(order);
}

//#endregion

//#region version

export function showVersionPatternCompletion(bits) {
  Array.from(bits).forEach((b, i) => {
    // bottom left
    paintModule(
      ELEMENTS.VERSION_PATTERN_COMPLETION_1,
      b,
      5 - Math.floor(i / 3),
      2 - (i % 3),
      i,
      versionPatternLightColor,
      versionPatternDarkColor
    );
    // top right
    paintModule(
      ELEMENTS.VERSION_PATTERN_COMPLETION_2,
      b,
      2 - (i % 3),
      5 - Math.floor(i / 3),
      i,
      versionPatternLightColor,
      versionPatternDarkColor
    );
  });
}

//#endregion version

//#region format

export function showFormatPatternCompletion(bits) {
  // top left
  Array.from(bits.substring(0, 8)).forEach((b, i) => {
    const x = i >= 6 ? i + 1 : i;
    paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_1, b, x, 8, i, formatPatternLightColor, formatPatternDarkColor);
  });
  Array.from(bits.substring(8)).forEach((b, i) => {
    const y = 7 - (i >= 1 ? i + 1 : i);
    paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_1, b, 8, y, i + 8, formatPatternLightColor, formatPatternDarkColor);
  });

  // bottom left
  Array.from(bits.substring(0, 7)).map((b, i) => {
    paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_2, b, 0, 8 - i, i, formatPatternLightColor, formatPatternDarkColor);
  });
  // on the bottom left, this module is always dark
  paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_2, 0, 0, 1, 0, defaultDarkColor, defaultDarkColor);

  // top right
  Array.from(bits.substring(7)).map((b, i) => {
    paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_3, b, i, 0, i + 7, formatPatternLightColor, formatPatternDarkColor);
  });
}

//#endregion format
