import { ELEMENTS } from './elements';
import { QR_CODE_VERSIONS } from './qr-code-versions';

//#region versions

export function createVersionsTable() {
  const versionsTableBody = ELEMENTS.VERSIONS_TABLE.querySelector('tbody');

  QR_CODE_VERSIONS.forEach((v) => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.innerHTML = v.version;

    const td2 = document.createElement('td');
    td2.textContent = v.size;

    const td3 = document.createElement('td');
    td3.textContent = `L: ${v.errorCapacity.L}`;

    const td4 = document.createElement('td');
    td4.textContent = `M: ${v.errorCapacity.M}`;

    const td5 = document.createElement('td');
    td5.textContent = `Q: ${v.errorCapacity.Q}`;

    const td6 = document.createElement('td');
    td6.textContent = `H: ${v.errorCapacity.H}`;

    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    tr.append(td6);
    versionsTableBody.append(tr);
  });
}

export function hightlightVersionInVersionsTable(version, errorCapacity) {
  // unselect all rows and columns
  Array.from(ELEMENTS.VERSIONS_TABLE.querySelectorAll('tbody tr')).forEach((tr) => {
    tr.classList.remove('selected');
    Array.from(tr.querySelectorAll('td')).forEach((column) => column.classList.remove('selected'));
  });

  // select the row and version and errorCapacity columns
  const versionRow = ELEMENTS.VERSIONS_TABLE.querySelectorAll('tbody tr')[version - 1];
  versionRow.classList.add('selected');
  versionRow.children[0].classList.add('selected');
  versionRow.children[2 + ['L', 'M', 'Q', 'H'].indexOf(errorCapacity)].classList.add('selected');

  // scroll to show the selected version
  ELEMENTS.VERSIONS_TABLE.scrollTop = versionRow.offsetTop - ELEMENTS.VERSIONS_TABLE.clientHeight / 2 + 50; // 50 header table
}

//#endregion versions

//#region alignment

export function createAlignmentPatternsTable() {
  const bodyTable = ELEMENTS.ALIGNMENT_PATTERN_TABLE.querySelector('tbody');

  QR_CODE_VERSIONS.forEach((version) => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = version.version;

    const td2 = document.createElement('td');
    if (version.version === 1) {
      td2.textContent = 'No tiene';
    } else if (version.version <= 6) {
      td2.textContent = '1';
    } else {
      td2.textContent = version.alignmentPatternPositions.length * version.alignmentPatternPositions.length - 3;
    }

    const td3 = document.createElement('td');
    td3.textContent = version.alignmentPatternPositions.map((p) => p + 3).join(', ');

    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    bodyTable.append(tr);
  });
}

export function hightlightVersionInAlignmentPatternsTable(version) {
  // unselect all rows
  Array.from(ELEMENTS.ALIGNMENT_PATTERN_TABLE.querySelectorAll('tbody tr')).forEach((tr) => tr.classList.remove('selected'));

  // select the row
  const versionRow = ELEMENTS.ALIGNMENT_PATTERN_TABLE.querySelectorAll('tbody tr')[version - 1];
  versionRow.classList.add('selected');

  // scroll to show the selected version
  ELEMENTS.ALIGNMENT_PATTERN_TABLE.scrollTop = versionRow.offsetTop - ELEMENTS.ALIGNMENT_PATTERN_TABLE.clientHeight / 2 + 50; // 50 header table
}

//#endregion alignment
