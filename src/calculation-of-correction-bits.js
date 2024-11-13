import {
  defaultDarkColor,
  formatInformationDarkColor,
  formatInformationLightColor,
  versionInformationDarkColor,
  versionInformationLightColor,
} from './colors';
import { ELEMENTS } from './elements';
import { applyXOR, paintSvgBitAt } from './qr-code-utils';
import { TABLE_9 } from './table-9';
import { TABLE_A1 } from './table-a1';

// TODO is it possible to create a generic function with parameters that serves for both cases version and format?
// TODO rename first13bits and first11bits variables to avoid confusion in the return

//#region version

const VERSION_GENERATOR = '1111100100101';

export function calculateCorrectionBitsForVersion(version6bits) {
  const VERSION_WITH_18_BITS = version6bits + '0'.repeat(12);

  let first13bits = VERSION_WITH_18_BITS.substring(0, 13);
  const LAST_ITERATION = 5;
  for (let i = 0; i <= LAST_ITERATION; i++) {
    if (first13bits[0] === '0') {
      first13bits = first13bits.substring(1); // remove first bit

      // put down next bit
      if (i !== LAST_ITERATION) {
        first13bits += '0';
      }
      continue;
    }

    let rest = '';
    for (let j = 1; j < VERSION_GENERATOR.length; j++) {
      const xor = VERSION_GENERATOR[j] === first13bits[j] ? '0' : '1';
      rest += xor;
    }
    first13bits = rest;

    // put down next bit
    if (i !== LAST_ITERATION) {
      first13bits += '0';
    }
  }

  return first13bits;
}

export function showHowVersionCorrectionBitsAreCalculated(version6Bits) {
  const svgEl = ELEMENTS.CALCULATION_OF_VERSION_CORRECTION_BITS;
  Array.from(svgEl.children).forEach((child) => child.remove());
  let svgHeight = 1;
  const VERSION_WITH_18_BITS = version6Bits + '0'.repeat(12);
  const MARGIN = 5;

  // print the division (first line)
  for (let i = 0; i < VERSION_WITH_18_BITS.length; i++) {
    paintSvgBitAt(svgEl, VERSION_WITH_18_BITS[i], i, 1);
  }
  for (let i = 0; i < VERSION_GENERATOR.length; i++) {
    paintSvgBitAt(svgEl, VERSION_GENERATOR[i], VERSION_WITH_18_BITS.length + MARGIN + i, 1, '#f00');
  }

  // print first 13 bits for first iteration
  let first13bits = VERSION_WITH_18_BITS.substring(0, 13);
  svgHeight++;
  for (let i = 0; i < first13bits.length; i++) {
    paintSvgBitAt(svgEl, first13bits[i], i, svgHeight);
  }

  // division
  const LAST_ITERATION = 5;
  for (let i = 0; i <= LAST_ITERATION; i++) {
    svgHeight++;

    if (first13bits[0] === '0') {
      // print quotient (second line)
      paintSvgBitAt(svgEl, '0', VERSION_WITH_18_BITS.length + MARGIN + i, 2, '#aaa');

      // print next 12 bits
      first13bits = first13bits.substring(1); // remove first bit
      for (let j = 0; j < first13bits.length; j++) {
        paintSvgBitAt(svgEl, first13bits[j], i + j + 1, svgHeight, i === LAST_ITERATION ? '#bc00bc' : '#000');
      }

      // put down next bit
      if (i !== LAST_ITERATION) {
        first13bits += '0';
        paintSvgBitAt(svgEl, '0', i + first13bits.length, svgHeight, '#00df00');
      }
      continue;
    }

    // print quotient (second line)
    paintSvgBitAt(svgEl, '1', VERSION_WITH_18_BITS.length + MARGIN + i, 2, '#ffbfbf');

    // print generator for xor
    for (let j = 0; j < VERSION_GENERATOR.length; j++) {
      paintSvgBitAt(svgEl, VERSION_GENERATOR[j], i + j, svgHeight, '#f00');
    }

    // print rest of xor
    svgHeight++;
    // print first 0 that will be removed in next iteration
    paintSvgBitAt(svgEl, '0', i, svgHeight, '#00f2');
    // calculate the rest (avoid calculating first bit that is always 0 and is already printed just above)
    let rest = '';
    for (let j = 1; j < VERSION_GENERATOR.length; j++) {
      const xor = VERSION_GENERATOR[j] === first13bits[j] ? '0' : '1';
      rest += xor;
      paintSvgBitAt(svgEl, xor, i + j, svgHeight, i === LAST_ITERATION ? '#bc00bc' : '#000');
    }
    first13bits = rest;

    // put down next bit
    if (i !== LAST_ITERATION) {
      first13bits += '0';
      paintSvgBitAt(svgEl, '0', VERSION_GENERATOR.length + i, svgHeight, '#00df00');
    }
  }

  svgEl.setAttribute('viewBox', `0 0 36 ${svgHeight + 0.5}`);
}

export function showVersionPatternCompletion(bits) {
  Array.from(bits).forEach((b, i) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 5 - Math.floor(i / 3));
    rect.setAttribute('y', 2 - (i % 3));
    rect.setAttribute('width', '1');
    rect.setAttribute('height', '1');
    rect.setAttribute('stroke-width', '0');
    rect.setAttribute('fill', b === '0' ? versionInformationLightColor : versionInformationDarkColor);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 5.3 - Math.floor(i / 3));
    text.setAttribute('y', 2.7 - (i % 3));
    text.setAttribute('fill', b === '0' ? versionInformationDarkColor : versionInformationLightColor);
    text.textContent = b;
    text.setAttribute('font-size', '0.6');

    const position = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    position.setAttribute('x', 5.95 - Math.floor(i / 3));
    position.setAttribute('y', 2.9 - (i % 3));
    position.setAttribute('fill', '#000');
    position.textContent = `(${i + 1})`;
    position.setAttribute('font-size', '0.2');
    position.setAttribute('text-anchor', 'end');

    ELEMENTS.VERSION_PATTERN_COMPLETION_1.append(rect);
    ELEMENTS.VERSION_PATTERN_COMPLETION_1.append(text);
    ELEMENTS.VERSION_PATTERN_COMPLETION_1.append(position);
  });

  Array.from(bits).forEach((b, i) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 2 - (i % 3));
    rect.setAttribute('y', 5 - Math.floor(i / 3));
    rect.setAttribute('width', '1');
    rect.setAttribute('height', '1');
    rect.setAttribute('stroke-width', '0');
    rect.setAttribute('fill', b === '0' ? versionInformationLightColor : versionInformationDarkColor);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 2.3 - (i % 3));
    text.setAttribute('y', 5.7 - Math.floor(i / 3));
    text.setAttribute('fill', b === '0' ? versionInformationDarkColor : versionInformationLightColor);
    text.textContent = b;
    text.setAttribute('font-size', '0.6');

    const position = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    position.setAttribute('x', 2.95 - (i % 3));
    position.setAttribute('y', 5.9 - Math.floor(i / 3));
    position.setAttribute('fill', '#000');
    position.textContent = `(${i + 1})`;
    position.setAttribute('font-size', '0.2');
    position.setAttribute('text-anchor', 'end');

    ELEMENTS.VERSION_PATTERN_COMPLETION_2.append(rect);
    ELEMENTS.VERSION_PATTERN_COMPLETION_2.append(text);
    ELEMENTS.VERSION_PATTERN_COMPLETION_2.append(position);
  });
}

//#endregion version

//#region format

const FORMAT_GENERATOR = '10100110111';

export function calculateCorrectionBitsForFormat(errorAndMask5Bits) {
  const VERSION_WITH_15_BITS = errorAndMask5Bits + '0'.repeat(10);

  let first11bits = VERSION_WITH_15_BITS.substring(0, 11);
  const LAST_ITERATION = 4;
  for (let i = 0; i <= LAST_ITERATION; i++) {
    if (first11bits[0] === '0') {
      first11bits = first11bits.substring(1); // remove first bit

      // put down next bit
      if (i !== LAST_ITERATION) {
        first11bits += '0';
      }
      continue;
    }

    let rest = '';
    for (let j = 1; j < FORMAT_GENERATOR.length; j++) {
      const xor = FORMAT_GENERATOR[j] === first11bits[j] ? '0' : '1';
      rest += xor;
    }
    first11bits = rest;

    // put down next bit
    if (i !== LAST_ITERATION) {
      first11bits += '0';
    }
  }

  return first11bits;
}

export function showHowFormatCorrectionBitsAreCalculated(errorAndMask5Bits) {
  const svgEl = ELEMENTS.CALCULATION_OF_FORMAT_CORRECTION_BITS;
  Array.from(svgEl.children).forEach((child) => child.remove());
  let svgHeight = 1;
  const VERSION_WITH_15_BITS = errorAndMask5Bits + '0'.repeat(10);
  const MARGIN = 5;

  // print the division (first line)
  for (let i = 0; i < VERSION_WITH_15_BITS.length; i++) {
    paintSvgBitAt(svgEl, VERSION_WITH_15_BITS[i], i, 1);
  }
  for (let i = 0; i < FORMAT_GENERATOR.length; i++) {
    paintSvgBitAt(svgEl, FORMAT_GENERATOR[i], VERSION_WITH_15_BITS.length + MARGIN + i, 1, '#f00');
  }

  // print first 13 bits for first iteration
  let first11bits = VERSION_WITH_15_BITS.substring(0, 11);
  svgHeight++;
  for (let i = 0; i < first11bits.length; i++) {
    paintSvgBitAt(svgEl, first11bits[i], i, svgHeight);
  }

  // division
  const LAST_ITERATION = 4;
  for (let i = 0; i <= LAST_ITERATION; i++) {
    svgHeight++;

    if (first11bits[0] === '0') {
      // print quotient (second line)
      paintSvgBitAt(svgEl, '0', VERSION_WITH_15_BITS.length + MARGIN + i, 2, '#aaa');

      // print next 12 bits
      first11bits = first11bits.substring(1); // remove first bit
      for (let j = 0; j < first11bits.length; j++) {
        paintSvgBitAt(svgEl, first11bits[j], i + j + 1, svgHeight, i === LAST_ITERATION ? '#bc00bc' : '#000');
      }

      // put down next bit
      if (i !== LAST_ITERATION) {
        first11bits += '0';
        paintSvgBitAt(svgEl, '0', i + first11bits.length, svgHeight, '#00df00');
      }
      continue;
    }

    // print quotient (second line)
    paintSvgBitAt(svgEl, '1', VERSION_WITH_15_BITS.length + MARGIN + i, 2, '#ffbfbf');

    // print generator for xor
    for (let j = 0; j < FORMAT_GENERATOR.length; j++) {
      paintSvgBitAt(svgEl, FORMAT_GENERATOR[j], i + j, svgHeight, '#f00');
    }

    // print rest of xor
    svgHeight++;
    // print first 0 that will be removed in next iteration
    paintSvgBitAt(svgEl, '0', i, svgHeight, '#00f2');
    // calculate the rest (avoid calculating first bit that is always 0 and is already printed just above)
    let rest = '';
    for (let j = 1; j < FORMAT_GENERATOR.length; j++) {
      const xor = FORMAT_GENERATOR[j] === first11bits[j] ? '0' : '1';
      rest += xor;
      paintSvgBitAt(svgEl, xor, i + j, svgHeight, i === LAST_ITERATION ? '#bc00bc' : '#000');
    }
    first11bits = rest;

    // put down next bit
    if (i !== LAST_ITERATION) {
      first11bits += '0';
      paintSvgBitAt(svgEl, '0', FORMAT_GENERATOR.length + i, svgHeight, '#00df00');
    }
  }

  svgEl.setAttribute('viewBox', `0 0 31 ${svgHeight + 0.5}`);
}

export function showFormatPatternCompletion(bits) {
  let rowI = 8;
  let columnI = 0;
  // top left
  Array.from(bits).forEach((b, i) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', columnI);
    rect.setAttribute('y', rowI);
    rect.setAttribute('width', '1');
    rect.setAttribute('height', '1');
    rect.setAttribute('stroke-width', '0');
    rect.setAttribute('fill', b === '0' ? formatInformationLightColor : formatInformationDarkColor);

    const bitValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bitValue.setAttribute('x', columnI + 0.3);
    bitValue.setAttribute('y', rowI + 0.7);
    bitValue.setAttribute('fill', b === '0' ? formatInformationDarkColor : formatInformationLightColor);
    bitValue.textContent = b;
    bitValue.setAttribute('font-size', '0.6');

    const position = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    position.setAttribute('x', columnI + 0.95);
    position.setAttribute('y', rowI + 0.9);
    position.setAttribute('fill', '#000');
    position.textContent = `(${i + 1})`;
    position.setAttribute('font-size', '0.2');
    position.setAttribute('text-anchor', 'end');

    ELEMENTS.FORMAT_PATTERN_COMPLETION_1.append(rect);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_1.append(bitValue);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_1.append(position);

    if (i < 5) columnI++;
    else if (i === 5) columnI += 2;
    else if (i === 6) columnI++;
    else if (i === 7) rowI--;
    else if (i === 8) rowI -= 2;
    else rowI--;
  });

  // bottom left
  Array.from(bits.substring(0, 7)).map((b, i) => {
    const module = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    module.setAttribute('x', 0);
    module.setAttribute('y', 8 - i);
    module.setAttribute('width', '1');
    module.setAttribute('height', '1');
    module.setAttribute('stroke-width', '0');
    module.setAttribute('fill', b === '0' ? formatInformationLightColor : formatInformationDarkColor);

    const bitValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bitValue.setAttribute('x', 0 + 0.3);
    bitValue.setAttribute('y', 8 - i + 0.7);
    bitValue.setAttribute('fill', b === '0' ? formatInformationDarkColor : formatInformationLightColor);
    bitValue.textContent = b;
    bitValue.setAttribute('font-size', '0.6');

    const position = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    position.setAttribute('x', 0 + 0.95);
    position.setAttribute('y', 8 - i + 0.9);
    position.setAttribute('fill', '#000');
    position.textContent = `(${i + 1})`;
    position.setAttribute('font-size', '0.2');
    position.setAttribute('text-anchor', 'end');

    ELEMENTS.FORMAT_PATTERN_COMPLETION_2.append(module);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_2.append(bitValue);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_2.append(position);
  });

  // on the bottom left, this module is always dark
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', 0);
  rect.setAttribute('y', 1);
  rect.setAttribute('width', '1');
  rect.setAttribute('height', '1');
  rect.setAttribute('stroke-width', '0');
  rect.setAttribute('fill', defaultDarkColor);
  ELEMENTS.FORMAT_PATTERN_COMPLETION_2.append(rect);

  // top right
  Array.from(bits.substring(7)).map((b, i) => {
    const module = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    module.setAttribute('x', i);
    module.setAttribute('y', 0);
    module.setAttribute('width', '1');
    module.setAttribute('height', '1');
    module.setAttribute('stroke-width', '0');
    module.setAttribute('fill', b === '0' ? formatInformationLightColor : formatInformationDarkColor);

    const bitValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bitValue.setAttribute('x', i + 0.3);
    bitValue.setAttribute('y', 0.7);
    bitValue.setAttribute('fill', b === '0' ? formatInformationDarkColor : formatInformationLightColor);
    bitValue.textContent = b;
    bitValue.setAttribute('font-size', '0.6');

    const position = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    position.setAttribute('x', i + 0.95);
    position.setAttribute('y', 0.9);
    position.setAttribute('fill', '#000');
    position.textContent = `(${i + 8})`;
    position.setAttribute('font-size', '0.2');
    position.setAttribute('text-anchor', 'end');

    ELEMENTS.FORMAT_PATTERN_COMPLETION_3.append(module);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_3.append(bitValue);
    ELEMENTS.FORMAT_PATTERN_COMPLETION_3.append(position);
  });
}

//#endregion format

//#region data

export function calculateErrorCorrectionBitsForDataEntered(message, qrCodeVersion, errorCapacity) {
  // TODO extract funcion to convert to binary
  let messageInBinary = '0100';

  // version 1 to 9 -> 8 modules, version 10 to 40 -> 16 modules
  const modulesLength = qrCodeVersion.size <= 53 ? 8 : 16;
  const messageLengthInBinary = (message.length >>> 0).toString(2).padStart(modulesLength, '0');
  messageInBinary += messageLengthInBinary;

  for (let i = 0; i < message.length; i++) {
    messageInBinary += `${(+message.charCodeAt(i) >>> 0).toString(2).padStart(8, '0')}`;
  }
  // append padding
  messageInBinary += '0000';

  // TODO append PAd codewords
  const padCodeword1 = '11101100';
  const padCodeword2 = '00010001';
  let totalLength = message.length;
  while (totalLength < qrCodeVersion.errorCapacity[errorCapacity]) {
    messageInBinary += padCodeword1 + padCodeword2;
    totalLength += 2;
  }
  messageInBinary = messageInBinary.slice(0, 8 + modulesLength + qrCodeVersion.errorCapacity[errorCapacity] * 8);

  // console.log('MESSAG IN BINARY', messageInBinary, 'length', messageInBinary.length, '->', messageInBinary.length / 8);

  // divide in blocks
  let messageInBinaryCopy = messageInBinary;
  const blocks = [];
  const blocksStructure = TABLE_9[qrCodeVersion.version - 1][errorCapacity];
  // console.log('blocksStructure', blocksStructure);
  blocksStructure.forEach((block) => {
    for (let i = 0; i < block.numberOfBlocks; i++) {
      blocks.push(messageInBinaryCopy.slice(0, block.dataCodewordsPerBlock * 8));
      messageInBinaryCopy = messageInBinaryCopy.slice(block.dataCodewordsPerBlock * 8);
    }
  });

  let errorCorrectionBits = '';
  const errorCorrectionCodewordsPerBlock =
    TABLE_9[qrCodeVersion.version - 1].numberOfErrorCorrectionCodewords[errorCapacity] / blocks.length;

  blocks.forEach((block) => {
    const coeficients = TABLE_A1.find((e) => e.numberOfErrorCorrectionCodewords === errorCorrectionCodewordsPerBlock).coeficients;
    // console.log('alpha exponents', coeficients);
    // console.log('coeficients.length', coeficients.length);
    // console.log('coeficients as primitives: ', coeficients.map((c) => parseInt(getPrimitiveAsBinary(c), 2)));
    const primitives = coeficients.map((c) => parseInt(getPrimitiveAsBinary(c), 2));
    // console.log('primitives decimal', primitives);
    const coeficientsInBinary = coeficients.map((c) => getPrimitiveAsBinary(c)).join('');

    errorCorrectionBits += dividePolinomials(block, coeficientsInBinary);
  });

  return errorCorrectionBits;
}

function getPrimitiveAsBinary(alphaExponent) {
  // https://codyplanteen.com/assets/rs/gf256_log_antilog.pdf pagina 3

  const primitive = 2; // value of alpha
  const polinomioIrreducible = '100011101';

  function reduce(result) {
    let reduceBinary = (result >>> 0).toString(2);

    let rest = '';
    for (let j = 0; j < 9; j++) {
      const xor = reduceBinary[j] === polinomioIrreducible[j] ? '0' : '1';
      rest += xor;
    }

    return parseInt(rest, 2);
  }

  let result = 1;
  for (let i = 1; i <= alphaExponent; i++) {
    if (alphaExponent === 255) {
      result = 0;
      break;
    }

    result *= primitive;

    if (result > 255) {
      result = reduce(result);
    }
  }

  // console.log('primitieve converted, exponent was', alphaExponent, ' result is ', result);
  return (result >>> 0).toString(2).padStart(8, '0');
}

/************************************** GITHUB **************************************/
/************************************** GITHUB **************************************/
/************************************** GITHUB **************************************/

function add(a, b) {
	return a ^ b;
}

function multiply(a, b) {
  // Si cualquiera de los dos operandos es cero devolvemos cero.
  if (a == 0 || b == 0) {
    return 0;
  }
  // Si uno de los dos operandos es 1 devolvemos el otro operando.
  if (a == 1) {
    return b;
  }
  if (b == 1) {
    return a;
  }
  return expTable[(logTable[a] + logTable[b]) % 255];
}

const IRREDUCTIBLE_POLINOMIAL = 0x11d; // m(x) = x^8 + x^4 + x^3 + x^2 + 1
const expTable = (function createExponentialsTable() {
  let expTable = new Array(256);
  let x = 1;
  for (let i = 0; i <= 256 - 1; i++) {
    expTable[i] = x;
    x = x * 2;
    if (x >= 256) {
      x = x ^ IRREDUCTIBLE_POLINOMIAL;
    }
  }

  return expTable;
})();

const logTable = (function createLogarithmsTable() {
  let logTable = new Array(256);
  for (let i = 0; i < 256 - 1; i++) {
    logTable[expTable[i]] = i;
  }
  logTable[0] = undefined;
  return logTable;
})();

// console.log({ expTable, logTable });

function divide(a, b) {
  if (b == 0) {
    throw new Error('divide() cannot divide by zero');
  }
  if (a == 0) {
    return 0;
  }
  if (b == 1) {
    return a;
  }
  return expTable[(logTable[a] - logTable[b]) % 255];
}

function dividePolinomials(dividendBinary, divisorBinary) {
  const dividendDecimal = dividendBinary.match(/.{1,8}/g).map((b) => parseInt(b, 2));
  const divisorDecimal = divisorBinary.match(/.{1,8}/g).map((b) => parseInt(b, 2));
  dividendDecimal.push(...new Array(divisorDecimal.length-1).fill(0))

  for (let i = 0; i < dividendDecimal.length - divisorDecimal.length + 1; i++) {
    // for (let i = 0; i < 1; i++) {
    // console.warn('iteration ', i);
    // console.log('dividendDecimal', dividendDecimal);
    // console.log('divisorDecimal', divisorDecimal);

    const div = divide(dividendDecimal[i], divisorDecimal[0]);
    // console.log('division', div);

    const mult = divisorDecimal.map((gx) => multiply(gx, div));
    // console.log('mult', mult);

    for (let j = 0; j < mult.length; j++) {
      // sum = subtract = xor
      dividendDecimal[i + j] = add(dividendDecimal[i + j], mult[j])
    }

    // console.error('dividedDecimal at the end', dividendDecimal);
  }

  return dividendDecimal
    .slice(-(divisorDecimal.length - 1))
    .map((d) => (d >>> 0).toString(2).padStart(8, '0'))
    .join('');
}
//#endregion data
