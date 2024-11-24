import { MODULE_TYPE } from './module-type';
import { QR_CODE_STANDARS } from './qr-code-standards';

//#region general

export function createQrCodeMatrix(size = 21) {
  const qrCode = [];
  for (let row = 0; row < size; row++) {
    qrCode[row] = [];
    for (let column = 0; column < size; column++) {
      qrCode[row][column] = { type: MODULE_TYPE.NOT_DEFINED };
    }
  }
  return qrCode;
}

/**
 * @param {*} modulePositions [[row, column], [row, column], ...]
 */
export function paintModules(qrCodeMatrix, modulePositions, module) {
  modulePositions.forEach((mp) => (qrCodeMatrix[mp[0]][mp[1]] = { ...module }));
}

export function paintRowRangeModules(qrCodeMatrix, row, init, end, module) {
  for (let column = init; column <= end; column++) {
    qrCodeMatrix[row][column] = { ...module };
  }
}

export function paintColumnRangeModules(qrCodeMatrix, column, init, end, module) {
  for (let row = init; row <= end; row++) {
    qrCodeMatrix[row][column] = { ...module };
  }
}

//#endregion

//#region position

function paintModulesForAPositionPatternAt(qrCodeMatrix, row, column, module) {
  const darkModule = { ...module, bit: '1' };
  const lightModule = { ...module, bit: '0' };

  // outside border
  paintRowRangeModules(qrCodeMatrix, row, column, column + 6, darkModule);
  paintColumnRangeModules(qrCodeMatrix, column + 6, row + 1, row + 5, darkModule);
  paintRowRangeModules(qrCodeMatrix, row + 6, column, column + 6, darkModule);
  paintColumnRangeModules(qrCodeMatrix, column, row + 1, row + 5, darkModule);

  // inside border
  paintRowRangeModules(qrCodeMatrix, row + 1, column + 1, column + 5, lightModule);
  paintColumnRangeModules(qrCodeMatrix, column + 5, row + 2, row + 4, lightModule);
  paintRowRangeModules(qrCodeMatrix, row + 5, column + 1, column + 5, lightModule);
  paintColumnRangeModules(qrCodeMatrix, column + 1, row + 2, row + 4, lightModule);

  // center square
  paintRowRangeModules(qrCodeMatrix, row + 2, column + 2, column + 4, darkModule);
  paintRowRangeModules(qrCodeMatrix, row + 3, column + 2, column + 4, darkModule);
  paintRowRangeModules(qrCodeMatrix, row + 4, column + 2, column + 4, darkModule);
}

export function paintModulesForAllPositionPatterns(qrCodeMatrix, module) {
  const positionModule = { ...module, type: MODULE_TYPE.POSITION };
  const separatorModule = { ...module, type: MODULE_TYPE.SEPARATOR, bit: '0' };

  // top left corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, 0, 0, positionModule);
  paintRowRangeModules(qrCodeMatrix, 7, 0, 7, separatorModule);
  paintColumnRangeModules(qrCodeMatrix, 7, 0, 6, separatorModule);

  // top right corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, 0, qrCodeMatrix.length - 7, positionModule);
  paintRowRangeModules(qrCodeMatrix, 7, qrCodeMatrix.length - 8, qrCodeMatrix.length - 1, separatorModule);
  paintColumnRangeModules(qrCodeMatrix, qrCodeMatrix.length - 8, 0, 6, separatorModule);

  // bottom left corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, qrCodeMatrix.length - 7, 0, positionModule);
  paintRowRangeModules(qrCodeMatrix, qrCodeMatrix.length - 8, 0, 7, separatorModule);
  paintColumnRangeModules(qrCodeMatrix, 7, qrCodeMatrix.length - 7, qrCodeMatrix.length - 1, separatorModule);
}

//#endregion position

//#region alignment

function paintModulesForAnAlignmentPatternAt(qrCodeMatrix, row, column, module) {
  const darkModule = { ...module, bit: '1' };
  const lightModule = { ...module, bit: '0' };

  // outside border
  paintRowRangeModules(qrCodeMatrix, row, column, column + 4, darkModule);
  paintColumnRangeModules(qrCodeMatrix, column, row + 1, row + 3, darkModule);
  paintRowRangeModules(qrCodeMatrix, row + 4, column, column + 4, darkModule);
  paintColumnRangeModules(qrCodeMatrix, column + 4, row + 1, row + 3, darkModule);

  // inside border
  paintRowRangeModules(qrCodeMatrix, row + 1, column + 1, column + 3, lightModule);
  paintModules(
    qrCodeMatrix,
    [
      [row + 2, column + 1],
      [row + 2, column + 3],
    ],
    lightModule
  );
  paintRowRangeModules(qrCodeMatrix, row + 3, column + 1, column + 3, lightModule);

  // center square
  paintModules(qrCodeMatrix, [[row + 2, column + 2]], darkModule);
}

/*
 * version 1 (21x21) -> no markers
 * from version 2 (25x25) to version 6 (41x41) -> 1 marker
 * from version 7 (45x45) to version 13 (69x69) -> 6 markers (1 - 3 - 2)
 * from version 14 (73x73) to version 20 (97x97) -> 13 markers (2 - 4 - 4 - 3)
 * from version 21 (101x101) to version 27 (125x125) -> 22 markers (3 - 5 - 5 - 5 - 4)
 * from version 28 (129x129) to version 34 (153x153) -> 33 markers (4 - 6 - 6 - 6 - 6 - 5)
 * from version 35 (157x157) to version 40 (177x177) -> 46 markers (5 - 7 - 7 - 7 - 7 - 7 - 6)
 */
export function paintModulesForAllAlignmentPatterns(qrCodeMatrix, module) {
  const alignmentModule = { ...module, type: MODULE_TYPE.ALIGNMENT };
  const patternPositions = QR_CODE_STANDARS.find((qr) => qr.size === qrCodeMatrix.length).alignmentPatternPositions;
  const numberOfPatterns = patternPositions.length;
  for (let i = 0; i < numberOfPatterns; i++) {
    for (let j = 0; j < numberOfPatterns; j++) {
      if (
        numberOfPatterns > 1 && // for version from 2 to 6, i and j are always 0 (do not evaluate next condition to paint always one pattern)
        // avoid alignment patterns above the position patterns
        ((i === 0 && j === 0) || (i === 0 && j === numberOfPatterns - 1) || (i === numberOfPatterns - 1 && j === 0))
      )
        continue;

      paintModulesForAnAlignmentPatternAt(qrCodeMatrix, patternPositions[i], patternPositions[j], alignmentModule);
    }
  }
}

//#endregion alignment

//#region timing-markers

export function paintModulesForAllTimingPatterns(qrCodeMatrix, module) {
  const darkModule = { ...module, type: MODULE_TYPE.TIMING, bit: '1' };
  const lightModule = { ...module, type: MODULE_TYPE.TIMING, bit: '0' };
  for (let i = 8; i < qrCodeMatrix.length - 8; i++) {
    // avoid painting over alignment patterns
    if (qrCodeMatrix[6][i].type === MODULE_TYPE.NOT_DEFINED) {
      qrCodeMatrix[6][i] = i % 2 ? lightModule : darkModule;
      qrCodeMatrix[i][6] = i % 2 ? lightModule : darkModule;
    }
  }
}

//#endregion timing-markers

//#region version

export function paintModulesForAllVersionPatterns(qrCodeMatrix, versionBits, module) {
  // they only appear from version 7 (45 x 45) onwards
  if (qrCodeMatrix.length < 45) {
    return;
  }

  const darkModule = { ...module, type: MODULE_TYPE.VERSION, bit: '1' };
  const lightModule = { ...module, type: MODULE_TYPE.VERSION, bit: '0' };

  // top right pattern
  for (let i = 0; i < versionBits.length; i++) {
    const m = versionBits[i] === '0' ? lightModule : darkModule;
    paintModules(qrCodeMatrix, [[5 - Math.floor(i / 3), qrCodeMatrix.length - 9 - (i % 3)]], m);
  }

  // bottom left pattern
  for (let i = 0; i < versionBits.length; i++) {
    const m = versionBits[i] === '0' ? lightModule : darkModule;
    paintModules(qrCodeMatrix, [[qrCodeMatrix.length - 9 - (i % 3), 5 - Math.floor(i / 3)]], m);
  }
}

//#endregion version

//#region format

export function paintModulesForAllFormatPatterns(qrCodeMatrix, formatBits, module) {
  const darkModule = { ...module, type: MODULE_TYPE.FORMAT, bit: '1' };
  const lightModule = { ...module, type: MODULE_TYPE.FORMAT, bit: '0' };

  // top left
  Array.from(formatBits.substring(0, 8)).forEach((b, i) => {
    const column = i >= 6 ? i + 1 : i;
    qrCodeMatrix[8][column] = b === '0' ? lightModule : darkModule;
  });
  Array.from(formatBits.substring(8)).forEach((b, i) => {
    const row = 7 - (i >= 1 ? i + 1 : i);
    qrCodeMatrix[row][8] = b === '0' ? lightModule : darkModule;
  });

  // bottom left
  Array.from(formatBits.substring(0, 7)).map((b, i) => {
    qrCodeMatrix[qrCodeMatrix.length - 1 - i][8] = b === '0' ? lightModule : darkModule;
  });
  // on the bottom left, this module is always dark
  qrCodeMatrix[qrCodeMatrix.length - 1 - 7][8] = darkModule;

  // top right
  Array.from(formatBits.substring(7)).map((b, i) => {
    qrCodeMatrix[8][qrCodeMatrix.length - 8 + i] = b === '0' ? lightModule : darkModule;
  });
}

//#endregion format

//#region data region

export function paintModulesForDataAndErrorRegion(qrCodeMatrix, modules) {
  if (modules.length === 0) return;

  let moduleIndex = 0;
  let timingPatternOffset = 1;

  for (let columnPair = Math.floor(qrCodeMatrix.length / 2); columnPair >= 0; columnPair--) {
    if (columnPair <= 3) {
      timingPatternOffset = 0;
    }

    if (columnPair % 2 === 0) {
      // the column is filled from bottom to top
      for (let row = qrCodeMatrix.length - 1; row >= 0; row--) {
        // left module
        if (qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset].type === MODULE_TYPE.NOT_DEFINED) {
          qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] = modules[moduleIndex];
          moduleIndex++;
          if (moduleIndex === modules.length) return;
        }

        // right module
        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset].type === MODULE_TYPE.NOT_DEFINED) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] = modules[moduleIndex];
          moduleIndex++;
          if (moduleIndex === modules.length) return;
        }
      }

      continue;
    }

    // the column is filled from top to bottom
    for (let row = 0; row <= qrCodeMatrix.length - 1; row++) {
      // left module
      if (qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset].type === MODULE_TYPE.NOT_DEFINED) {
        qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] = modules[moduleIndex];
        moduleIndex++;
        if (moduleIndex === modules.length) return;
      }

      // right module
      if (qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset].type === MODULE_TYPE.NOT_DEFINED) {
        qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] = modules[moduleIndex];
        moduleIndex++;
        if (moduleIndex === modules.length) return;
      }
    }
  }
}

//#endregion data region
