export const VERSION_GENERATOR = '1111100100101';
export const FORMAT_GENERATOR = '10100110111';

//#region raw bits

export function generateBchErrorCorrectionBits(bits, generator) {
  const bitsArray = Array.from(bits + '0'.repeat(generator.length - 1));

  for (let i = 0; i <= bitsArray.length - generator.length; i++) {
    if (bitsArray[i] === '0') continue;

    for (let j = 0; j < generator.length; j++) {
      bitsArray[i + j] = bitsArray[i + j] === generator[j] ? '0' : '1';
    }
  }

  return bitsArray.slice(bitsArray.length - generator.length + 1).join('');
}

//#endregion

//#region svg division

function paintSvgTextBitAt(svgEl, bit, x, y, color = '#000') {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.textContent = bit;
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', color);
  svgEl.append(text);
}

export function showSvgHowBchErrorCorrectionBitsAreCalculated(svgSelector, bits, generator) {
  const generatorColor = '#f00';
  const quotient0Color = '#aaa';
  const quotient1Color = '#ffbfbf';
  const discarded0Color = '#00f2';
  const nextBitColor = '#00df00';
  const finalReminderColor = '#bc00bc';
  const MARGIN = 5;
  let svgHeight = 1;

  // select and clear previous calculation
  const svgEl = document.querySelector(svgSelector);
  Array.from(svgEl.children).forEach((child) => child.remove());

  // append 0 at the end
  const bitsArray = Array.from(bits + '0'.repeat(generator.length - 1));

  // print dividend  (first line)
  for (let i = 0; i < bitsArray.length; i++) {
    paintSvgTextBitAt(svgEl, bitsArray[i], i, 1);
  }
  // print divisor (first line)
  for (let i = 0; i < generator.length; i++) {
    paintSvgTextBitAt(svgEl, generator[i], bitsArray.length + MARGIN + i, 1, generatorColor);
  }

  // print remainder bits for first iteration
  svgHeight++;
  for (let i = 0; i < generator.length; i++) {
    paintSvgTextBitAt(svgEl, bitsArray[i], i, svgHeight);
  }

  const LAST_ITERATION = bitsArray.length - generator.length;
  for (let i = 0; i <= LAST_ITERATION; i++) {
    // print quotient (second line)
    paintSvgTextBitAt(svgEl, bitsArray[i], bitsArray.length + MARGIN + i, 2, bitsArray[i] === '0' ? quotient0Color : quotient1Color);

    if (bitsArray[i] === '0') {
      // print next reminder bits
      svgHeight++;
      for (let j = 0; j < generator.length - 1; j++) {
        paintSvgTextBitAt(svgEl, bitsArray[i + j + 1], i + j + 1, svgHeight, i === LAST_ITERATION ? finalReminderColor : undefined);
      }
    }

    if (bitsArray[i] === '1') {
      // print generator for xor
      svgHeight++;
      for (let j = 0; j < generator.length; j++) {
        paintSvgTextBitAt(svgEl, generator[j], i + j, svgHeight, generatorColor);
      }

      // print result of xor
      svgHeight++;
      // print first 0 that will be removed in next iteration
      paintSvgTextBitAt(svgEl, '0', i, svgHeight, discarded0Color);
      for (let j = 1; j < generator.length; j++) {
        bitsArray[i + j] = bitsArray[i + j] === generator[j] ? '0' : '1';
        paintSvgTextBitAt(svgEl, bitsArray[i + j], i + j, svgHeight, i === LAST_ITERATION ? finalReminderColor : undefined);
      }
    }

    // put down next bit
    if (i !== LAST_ITERATION) {
      paintSvgTextBitAt(svgEl, '0', i + generator.length, svgHeight, nextBitColor);
    }
  }

  svgEl.setAttribute('viewBox', `0 0 ${bitsArray.length + generator.length + MARGIN} ${svgHeight + 0.5}`);
}

//#endregion
