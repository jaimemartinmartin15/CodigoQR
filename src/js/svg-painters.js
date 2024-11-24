import {
  defaultDarkColor,
  formatPatternDarkColor,
  formatPatternLightColor,
  versionPatternDarkColor,
  versionPatternLightColor,
} from './colors';
import { ELEMENTS } from './elements';
import { MODULE_TYPE } from './module-type';

//#region  paint qr code matrix

export function paintSvgQrCode(svgSelector, qrCodeMatrix, options) {
  const mergedOptions = { withGrid: true, margin: 0.025, labels: false, ...options };

  // select and clear previous results
  const svg = document.querySelector(svgSelector);
  svg.querySelectorAll('*').forEach((e) => e.remove());

  svg.setAttribute(
    'viewBox',
    `${-mergedOptions.margin} ${-mergedOptions.margin} ${qrCodeMatrix.length + mergedOptions.margin * 2} ${
      qrCodeMatrix.length + mergedOptions.margin * 2
    }`
  );

  for (let row = 0; row < qrCodeMatrix.length; row++) {
    for (let column = 0; column < qrCodeMatrix.length; column++) {
      const module = qrCodeMatrix[row][column];
      if (module.type !== MODULE_TYPE.NOT_DEFINED) {
        const svgModule = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svgModule.setAttribute('x', column);
        svgModule.setAttribute('y', row);
        svgModule.setAttribute('width', 1);
        svgModule.setAttribute('height', 1);
        svgModule.setAttribute('fill', module.bit === '0' ? module.lightColor : module.darkColor);
        svgModule.setAttribute('stroke-width', '0');
        svg.append(svgModule);

        if (mergedOptions.labels && module.letter) {
          const svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          svgLabel.setAttribute('x', column + 0.5);
          svgLabel.setAttribute('y', row + 0.8);
          svgLabel.setAttribute('text-anchor', 'middle');
          svgLabel.setAttribute('fill', module.bit === '0' ? module.darkColor : module.lightColor);
          svgLabel.textContent = module.letter;
          svgLabel.style.fontSize = '0.04rem';
          svg.append(svgLabel);
        }
      }
    }
  }

  if (mergedOptions.withGrid) {
    for (let row = 0; row <= qrCodeMatrix.length; row++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', row);
      line.setAttribute('x2', qrCodeMatrix.length);
      line.setAttribute('y2', row);
      line.setAttribute('stroke', defaultDarkColor);
      line.setAttribute('stroke-width', 0.05);
      svg.append(line);
    }

    for (let column = 0; column <= qrCodeMatrix.length; column++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', column);
      line.setAttribute('y1', 0);
      line.setAttribute('x2', column);
      line.setAttribute('y2', qrCodeMatrix.length);
      line.setAttribute('stroke', defaultDarkColor);
      line.setAttribute('stroke-width', 0.05);
      svg.append(line);
    }
  }
}

//#endregion

//#region common

// TODO check if this can be reused!
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

//#region data blocks

export function showHowToDivideDataBitStreamInBlocks(dataBlocks) {
  // clear previous calculation
  ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.innerHTML = '';

  dataBlocks.forEach((block) => {
    const svgBlock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBlock.setAttribute('viewBox', `0 0 ${block.length} 1`);
    svgBlock.classList.add('data-block');

    for (let moduleI = 0; moduleI < block.length; moduleI++) {
      const svgModule = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgModule.setAttribute('x', moduleI);
      svgModule.setAttribute('y', 0);
      svgModule.setAttribute('width', 1);
      svgModule.setAttribute('height', 1);
      svgModule.setAttribute('fill', block[moduleI].bit === '0' ? block[moduleI].lightColor : block[moduleI].darkColor);
      svgBlock.append(svgModule);

      if (block[moduleI].letter !== '') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', moduleI + 0.5);
        text.setAttribute('y', 0.75);
        text.setAttribute('fill', block[moduleI].bit === '0' ? block[moduleI].darkColor : block[moduleI].lightColor);
        text.textContent = block[moduleI].letter;
        const fontSize = block[moduleI].letter.length > 3 ? '0.020rem' : '0.035rem';
        text.style.fontSize = fontSize;
        svgBlock.append(text);
      }
    }

    ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.append(svgBlock);
  });
}

//#endregion
