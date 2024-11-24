import { ELEMENTS } from './elements';
import { QR_CODE_STANDARS } from './qr-code-standards';
import { numberToBinary } from './qr-code-utils';

//#region versions

export function createVersionsTable() {
  const versionsTableBody = ELEMENTS.VERSIONS_TABLE.querySelector('tbody');

  QR_CODE_STANDARS.forEach((v) => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.innerHTML = v.version;

    const td2 = document.createElement('td');
    td2.textContent = v.size;

    const td3 = document.createElement('td');
    td3.textContent = `L: ${v.errorCorrectionLevel.L.maxMessageLength}`;

    const td4 = document.createElement('td');
    td4.textContent = `M: ${v.errorCorrectionLevel.M.maxMessageLength}`;

    const td5 = document.createElement('td');
    td5.textContent = `Q: ${v.errorCorrectionLevel.Q.maxMessageLength}`;

    const td6 = document.createElement('td');
    td6.textContent = `H: ${v.errorCorrectionLevel.H.maxMessageLength}`;

    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    tr.append(td6);
    versionsTableBody.append(tr);
  });
}

export function hightlightVersionInVersionsTable(version, errorCorrectionLevel) {
  // unselect all rows and columns
  Array.from(ELEMENTS.VERSIONS_TABLE.querySelectorAll('tbody tr')).forEach((tr) => {
    tr.classList.remove('selected');
    Array.from(tr.querySelectorAll('td')).forEach((column) => column.classList.remove('selected'));
  });

  // select the row and version and errorCorrectionLevel columns
  const versionRow = ELEMENTS.VERSIONS_TABLE.querySelectorAll('tbody tr')[version - 1];
  versionRow.classList.add('selected');
  versionRow.children[0].classList.add('selected');
  versionRow.children[2 + ['L', 'M', 'Q', 'H'].indexOf(errorCorrectionLevel)].classList.add('selected');

  // scroll to show the selected version
  ELEMENTS.VERSIONS_TABLE.scrollTop = versionRow.offsetTop - ELEMENTS.VERSIONS_TABLE.clientHeight / 2 + 50; // 50 header table
}

//#endregion versions

//#region error correction level

export function hightlightErrorCorrectionLevelInTable(errorCorrectionLevel) {
  const tableIndexes = ['L', 'M', 'Q', 'H'];
  const headers = ELEMENTS.ERROR_CORRECTION_LEVEL_CODIFICATION_TABLE.querySelectorAll('thead th');
  const values = ELEMENTS.ERROR_CORRECTION_LEVEL_CODIFICATION_TABLE.querySelectorAll('tbody td');

  // unselect previous
  Array.from(headers).forEach((h) => h.classList.remove('selected'));
  Array.from(values).forEach((v) => v.classList.remove('selected'));

  // select new one
  Array.from(headers)[tableIndexes.indexOf(errorCorrectionLevel)].classList.add('selected');
  Array.from(values)[tableIndexes.indexOf(errorCorrectionLevel)].classList.add('selected');
}

//#endregion

//#region mask

export function hightlightWinnerMaskInTable(maskId) {
  const tableIndexes = ['000', '001', '010', '011', '100', '101', '110', '111'];
  const headers = ELEMENTS.MASK_CODIFICATION_TABLE.querySelectorAll('thead th');
  const values = ELEMENTS.MASK_CODIFICATION_TABLE.querySelectorAll('tbody td');

  // unselect previous
  Array.from(headers).forEach((h) => h.classList.remove('selected'));
  Array.from(values).forEach((v) => v.classList.remove('selected'));

  // select new one
  Array.from(headers)[tableIndexes.indexOf(maskId)].classList.add('selected');
  Array.from(values)[tableIndexes.indexOf(maskId)].classList.add('selected');
}

//#endregion

//#region message to ascii

export function createMessageToAsciiTable(message) {
  ELEMENTS.ASCII_MESSAGE_TABLE.innerHTML = '';
  for (let i = 0; i < message.length; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('element');
    svg.setAttribute('viewBox', ' 0 0 24 7');

    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.classList.add('header');
    header.setAttribute('x', '12');
    header.setAttribute('y', '1.6');
    header.textContent = `${message[i]} (${message.charCodeAt(i)})`;
    svg.append(header);

    for (let j = 0; j < 8; j++) {
      const index = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      index.classList.add('index');
      index.setAttribute('x', `${j * 2.6 + 3}`);
      index.setAttribute('y', '3.8');
      index.textContent = `${message[i]}${7 - j} `;
      svg.append(index);
    }

    const charInBinary = Array.from(numberToBinary(message.charCodeAt(i)));
    for (let j = 0; j < 8; j++) {
      const binary = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      binary.classList.add('bit');
      binary.setAttribute('x', `${j * 2.6 + 3}`);
      binary.setAttribute('y', '5.7');
      binary.textContent = `${charInBinary[j]}`;
      svg.append(binary);
    }

    ELEMENTS.ASCII_MESSAGE_TABLE.append(svg);
  }
}

//#endregion
