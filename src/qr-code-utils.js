import { DEFAULT_COLOR, defaultDarkColor } from './colors';

//#region qr code matrix

export function createQrCodeMatrix(size = 21, color = DEFAULT_COLOR) {
  const qrCode = [];
  for (let row = 0; row < size; row++) {
    qrCode[row] = [];
    for (let column = 0; column < size; column++) {
      qrCode[row][column] = color;
    }
  }
  return qrCode;
}

export function paintModules(qrCodeMatrix, modules, color = defaultDarkColor) {
  modules.forEach((m) => (qrCodeMatrix[m[0]][m[1]] = color));
}

export function paintRowRangeModules(qrCodeMatrix, row, init, end, color = defaultDarkColor) {
  for (let column = init; column <= end; column++) {
    qrCodeMatrix[row][column] = color;
  }
}

export function paintColumnRangeModules(qrCodeMatrix, column, init, end, color = defaultDarkColor) {
  for (let row = init; row <= end; row++) {
    qrCodeMatrix[row][column] = color;
  }
}

//#endregion qr code matrix

//#region svg

export function paintSvgQrCode(svgSelector, qrCodeMatrix, { withGrid, margin } = { withGrid: true, margin: 0.025 }) {
  const svg = document.querySelector(svgSelector);
  svg.querySelectorAll('*').forEach((e) => e.remove());

  svg.setAttribute('viewBox', `${-margin} ${-margin} ${qrCodeMatrix.length + margin * 2} ${qrCodeMatrix.length + margin * 2}`);

  for (let row = 0; row < qrCodeMatrix.length; row++) {
    for (let column = 0; column < qrCodeMatrix.length; column++) {
      let module = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      module.setAttribute('x', column);
      module.setAttribute('y', row);
      module.setAttribute('width', 1);
      module.setAttribute('height', 1);
      module.setAttribute('fill', qrCodeMatrix[row][column]);
      module.setAttribute('stroke-width', '0');
      svg.append(module);
    }
  }

  if (withGrid) {
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

export function paintSvgBitAt(svgEl, bit, x, y, color = defaultDarkColor) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.textContent = bit;
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', color);
  svgEl.append(text);
}

//#endregion svg

//#region xor

export function applyXOR(bits1, bits2) {
  let xor = '';
  for (let i = 0; i < bits1.length; i++) {
    xor += bits1[i] === bits2[i] ? '0' : '1';
  }
  return xor;
}

export function asciiToBinary(message) {
  let messageInBinary = '';
  for (let i = 0; i < message.length; i++) {
    messageInBinary += `${(+message.charCodeAt(i) >>> 0).toString(2).padStart(8, '0')}`;
  }
  return messageInBinary;
}

export function splitInBytes(binaryString) {
  return binaryString.match(/[01]{1,8}/g) ?? [];
}

export function getMessageLengthAsBinary(qrCodeVersionNumber, messageLength) {
  // version 1 to 9 -> 8 modules, version 10 to 40 -> 16 modules
  const modulesLength = qrCodeVersionNumber <= 9 ? 8 : 16;
  return numberToBinary(messageLength, modulesLength);
}

export function numberToBinary(n, maxLength = 8) {
  // number to binary
  return (n >>> 0).toString(2).padStart(maxLength, '0');
}

export function getPaddingCodewords(maxMessageLength, messageLength) {
  const padCodeword1 = '11101100';
  const padCodeword2 = '00010001';

  return `${padCodeword1}${padCodeword2}`.repeat(maxMessageLength - messageLength).substring(0, (maxMessageLength - messageLength) * 8);
}
