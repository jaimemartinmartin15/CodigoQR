import {
  defaultDarkColor,
  formatPatternDarkColor,
  formatPatternLightColor,
  versionPatternDarkColor,
  versionPatternLightColor,
} from './colors';
import { ELEMENTS } from './elements';
import { MODULE_TYPE } from './module-type';

//#region paint module

function paintModule(svg, x, y, module, options = {}) {
  // background
  const svgBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  svgBackground.setAttribute('x', x);
  svgBackground.setAttribute('y', y);
  svgBackground.setAttribute('width', '1');
  svgBackground.setAttribute('height', '1');
  svgBackground.setAttribute('stroke-width', '0');
  svgBackground.setAttribute('fill', module.bit === '0' ? module.lightColor : module.darkColor);
  svg.append(svgBackground);

  // value
  if (options.labels && module.letter) {
    const svgValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgValue.setAttribute('x', x + 0.5);
    svgValue.setAttribute('y', y + 0.7);
    svgValue.setAttribute('text-anchor', 'middle');
    svgValue.setAttribute('fill', module.bit === '0' ? module.darkColor : module.lightColor);
    svgValue.textContent = module.letter;
    const fontSize = module.letter.length > 3 ? '0.020rem' : '0.035rem';
    svgValue.style.fontSize = fontSize;
    svg.append(svgValue);
  }

  if (options.order !== undefined) {
    // order
    const svgOrder = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgOrder.setAttribute('x', x + 0.95);
    svgOrder.setAttribute('y', y + 0.9);
    svgOrder.setAttribute('text-anchor', 'end');
    svgOrder.setAttribute('fill', '#000');
    svgOrder.textContent = `(${options.order + 1})`;
    svgOrder.setAttribute('font-size', '0.012rem');
    svg.append(svgOrder);
  }
}

//#endregion

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
        paintModule(svg, column, row, module, mergedOptions);
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

//#region version

export function showVersionPatternCompletion(bits) {
  Array.from(bits).forEach((b, i) => {
    // bottom left
    paintModule(
      ELEMENTS.VERSION_PATTERN_COMPLETION_1,
      5 - Math.floor(i / 3),
      2 - (i % 3),
      { letter: b, bit: b, lightColor: versionPatternLightColor, darkColor: versionPatternDarkColor },
      { labels: true, order: i }
    );
    // top right
    paintModule(
      ELEMENTS.VERSION_PATTERN_COMPLETION_2,
      2 - (i % 3),
      5 - Math.floor(i / 3),
      { letter: b, bit: b, lightColor: versionPatternLightColor, darkColor: versionPatternDarkColor },
      { labels: true, order: i }
    );
  });
}

//#endregion version

//#region format

export function showFormatPatternCompletion(bits) {
  // top left
  Array.from(bits.substring(0, 8)).forEach((b, i) => {
    const x = i >= 6 ? i + 1 : i;
    paintModule(
      ELEMENTS.FORMAT_PATTERN_COMPLETION_1,
      x,
      8,
      { letter: b, bit: b, lightColor: formatPatternLightColor, darkColor: formatPatternDarkColor },
      { labels: true, order: i }
    );
  });
  Array.from(bits.substring(8)).forEach((b, i) => {
    const y = 7 - (i >= 1 ? i + 1 : i);
    paintModule(
      ELEMENTS.FORMAT_PATTERN_COMPLETION_1,
      8,
      y,
      { letter: b, bit: b, lightColor: formatPatternLightColor, darkColor: formatPatternDarkColor },
      { labels: true, order: i + 8 }
    );
  });

  // bottom left
  Array.from(bits.substring(0, 7)).map((b, i) => {
    paintModule(
      ELEMENTS.FORMAT_PATTERN_COMPLETION_2,
      0,
      8 - i,
      { letter: b, bit: b, lightColor: formatPatternLightColor, darkColor: formatPatternDarkColor },
      { labels: true, order: i }
    );
  });
  // on the bottom left, this module is always dark
  paintModule(ELEMENTS.FORMAT_PATTERN_COMPLETION_2, 0, 1, { bit: 1, darkColor: defaultDarkColor });

  // top right
  Array.from(bits.substring(7)).map((b, i) => {
    paintModule(
      ELEMENTS.FORMAT_PATTERN_COMPLETION_3,
      i,
      0,
      { letter: b, bit: b, lightColor: formatPatternLightColor, darkColor: formatPatternDarkColor },
      { labels: true, order: i + 7 }
    );
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
      paintModule(svgBlock, moduleI, 0, block[moduleI], { labels: true });
    }

    ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.append(svgBlock);
  });
}

//#endregion
