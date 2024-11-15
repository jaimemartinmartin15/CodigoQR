/*
 *  This file contains functions that receive a qr code matrix and paint its modules
 *   - position
 *   - alignment
 *   - timing
 *   - version
 *   - format
 *   - data and error
 *   - masks
 */

import { DEFAULT_COLOR, defaultDarkColor, defaultLightColor } from './colors';
import { paintColumnRangeModules, paintModules, paintRowRangeModules } from './qr-code-utils';
import { QR_CODE_INFO } from './qr-code-info';

//#region position

function paintModulesForAPositionPatternAt(qrCodeMatrix, row, column, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  // outside border
  paintRowRangeModules(qrCodeMatrix, row, column, column + 6, darkColor);
  paintColumnRangeModules(qrCodeMatrix, column + 6, row + 1, row + 5, darkColor);
  paintRowRangeModules(qrCodeMatrix, row + 6, column, column + 6, darkColor);
  paintColumnRangeModules(qrCodeMatrix, column, row + 1, row + 5, darkColor);

  // inside border
  paintRowRangeModules(qrCodeMatrix, row + 1, column + 1, column + 5, lightColor);
  paintColumnRangeModules(qrCodeMatrix, column + 5, row + 2, row + 4, lightColor);
  paintRowRangeModules(qrCodeMatrix, row + 5, column + 1, column + 5, lightColor);
  paintColumnRangeModules(qrCodeMatrix, column + 1, row + 2, row + 4, lightColor);

  // center square
  paintRowRangeModules(qrCodeMatrix, row + 2, column + 2, column + 4, darkColor);
  paintRowRangeModules(qrCodeMatrix, row + 3, column + 2, column + 4, darkColor);
  paintRowRangeModules(qrCodeMatrix, row + 4, column + 2, column + 4, darkColor);
}

export function paintModulesForAllPositionPatterns(qrCodeMatrix, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  // top left corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, 0, 0, darkColor, lightColor);
  paintRowRangeModules(qrCodeMatrix, 7, 0, 7, lightColor);
  paintColumnRangeModules(qrCodeMatrix, 7, 0, 6, lightColor);

  // top right corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, 0, qrCodeMatrix.length - 7, darkColor, lightColor);
  paintRowRangeModules(qrCodeMatrix, 7, qrCodeMatrix.length - 8, qrCodeMatrix.length - 1, lightColor);
  paintColumnRangeModules(qrCodeMatrix, qrCodeMatrix.length - 8, 0, 6, lightColor);

  // bottom left corner
  paintModulesForAPositionPatternAt(qrCodeMatrix, qrCodeMatrix.length - 7, 0, darkColor, lightColor);
  paintRowRangeModules(qrCodeMatrix, qrCodeMatrix.length - 8, 0, 7, lightColor);
  paintColumnRangeModules(qrCodeMatrix, 7, qrCodeMatrix.length - 7, qrCodeMatrix.length - 1, lightColor);
}

//#endregion position

//#region alignment

function paintModulesForAnAlignmentPatternAt(qrCodeMatrix, row, column, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  // outside border
  paintRowRangeModules(qrCodeMatrix, row, column, column + 4, darkColor);
  paintColumnRangeModules(qrCodeMatrix, column, row + 1, row + 3, darkColor);
  paintRowRangeModules(qrCodeMatrix, row + 4, column, column + 4, darkColor);
  paintColumnRangeModules(qrCodeMatrix, column + 4, row + 1, row + 3, darkColor);

  // inside border
  paintRowRangeModules(qrCodeMatrix, row + 1, column + 1, column + 3, lightColor);
  paintModules(
    qrCodeMatrix,
    [
      [row + 2, column + 1],
      [row + 2, column + 3],
    ],
    lightColor
  );
  paintRowRangeModules(qrCodeMatrix, row + 3, column + 1, column + 3, lightColor);

  // center square
  paintModules(qrCodeMatrix, [[row + 2, column + 2]], darkColor);
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
export function paintModulesForAllAlignmentPatterns(qrCodeMatrix, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  const patternPositions = QR_CODE_INFO.find((qr) => qr.size === qrCodeMatrix.length).alignmentPatternPositions;
  const numberOfPatterns = patternPositions.length;
  for (let i = 0; i < numberOfPatterns; i++) {
    for (let j = 0; j < numberOfPatterns; j++) {
      if (
        numberOfPatterns > 1 && // for version from 2 to 6, i and j are always 0 (do not evaluate next condition to paint always one pattern)
        // avoid alignment patterns above the position patterns
        ((i === 0 && j === 0) || (i === 0 && j === numberOfPatterns - 1) || (i === numberOfPatterns - 1 && j === 0))
      )
        continue;

      paintModulesForAnAlignmentPatternAt(qrCodeMatrix, patternPositions[i], patternPositions[j], darkColor, lightColor);
    }
  }
}

//#endregion alignment

//#region timing-markers

export function paintModulesForAllTimingPatterns(qrCodeMatrix, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  for (let i = 8; i < qrCodeMatrix.length - 8; i++) {
    // avoid painting over alignment patterns
    if (qrCodeMatrix[6][i] === DEFAULT_COLOR) {
      qrCodeMatrix[6][i] = i % 2 ? lightColor : darkColor;
      qrCodeMatrix[i][6] = i % 2 ? lightColor : darkColor;
    }
  }
}

//#endregion timing-markers

//#region version

export function paintModulesForAllVersionPatterns(qrCodeMatrix, versionBits, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  // they only appear from version 7 (45 x 45) onwards
  if (qrCodeMatrix.length < 45) {
    return;
  }

  // top right pattern
  for (let i = 0; i < versionBits.length; i++) {
    const color = versionBits[i] === '0' ? lightColor : darkColor;
    paintModules(qrCodeMatrix, [[5 - Math.floor(i / 3), qrCodeMatrix.length - 9 - (i % 3)]], color);
  }

  // bottom left pattern
  for (let i = 0; i < versionBits.length; i++) {
    const color = versionBits[i] === '0' ? lightColor : darkColor;
    paintModules(qrCodeMatrix, [[qrCodeMatrix.length - 9 - (i % 3), 5 - Math.floor(i / 3)]], color);
  }
}

//#endregion version

//#region format

export function paintModulesForAllFormatPatterns(qrCodeMatrix, formatBits, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  // top left
  let rowI = 8;
  let columnI = 0;
  Array.from(formatBits).forEach((b, bitI) => {
    qrCodeMatrix[rowI][columnI] = b === '0' ? lightColor : darkColor;

    if (bitI < 5) columnI++;
    else if (bitI === 5) columnI += 2;
    else if (bitI === 6) columnI++;
    else if (bitI === 7) rowI--;
    else if (bitI === 8) rowI -= 2;
    else rowI--;
  });

  // bottom left and top right
  rowI = qrCodeMatrix.length - 1;
  columnI = 8;
  Array.from(formatBits).forEach((b, i) => {
    qrCodeMatrix[rowI][columnI] = b === '0' ? lightColor : darkColor;

    if (i < 6) rowI--; // bottom left
    else if (i === 6) {
      // change index to top right
      rowI = 8;
      columnI = qrCodeMatrix.length - 8;
    } else columnI++;
  });

  // on the bottom left, this module is always dark
  paintModules(qrCodeMatrix, [[qrCodeMatrix.length - 8, 8]]);
}

//#endregion format

//#region data format

export function paintModulesForDataCodificationFormat(
  qrCodeMatrix,
  dataCodificationFormat,
  darkColor = defaultDarkColor,
  lightColor = defaultLightColor
) {
  const size = qrCodeMatrix.length - 1;
  qrCodeMatrix[size][size] = dataCodificationFormat[0] === '0' ? lightColor : darkColor;
  qrCodeMatrix[size][size - 1] = dataCodificationFormat[1] === '0' ? lightColor : darkColor;
  qrCodeMatrix[size - 1][size] = dataCodificationFormat[2] === '0' ? lightColor : darkColor;
  qrCodeMatrix[size - 1][size - 1] = dataCodificationFormat[3] === '0' ? lightColor : darkColor;
}

//#endregion data format

//#region number of characters

export function paintModulesForNumberOfCharactersEntered(
  qrCodeMatrix,
  messageLength,
  darkColor = defaultDarkColor,
  lightColor = defaultLightColor
) {
  // version 1 to 9 -> 8 modules, version 10 to 40 -> 16 modules
  const modulesLength = qrCodeMatrix.length <= 53 ? 8 : 16;
  const messageLengthInBinary = (messageLength >>> 0).toString(2).padStart(modulesLength, '0');

  let row = qrCodeMatrix.length - 1 - 2;
  let column = qrCodeMatrix.length - 1;
  Array.from(messageLengthInBinary).forEach((b) => {
    const color = b === '0' ? lightColor : darkColor;
    qrCodeMatrix[row][column] = color;

    if (column === qrCodeMatrix.length - 1) {
      column--;
    } else {
      column += 1;
      row--;
    }
  });
}

//#endregion number of characters

//#region data entered

export function paintModulesForDataEntered(qrCodeMatrix, message, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  let messageInBinary = '';
  for (let i = 0; i < message.length; i++) {
    messageInBinary += `${(+message.charCodeAt(i) >>> 0).toString(2).padStart(8, '0')}`;
  }
  // append padding
  messageInBinary += '0000';

  let mI = 0;
  for (let columnPair = qrCodeMatrix.length / 2; columnPair >= 0; columnPair--) {
    if (Math.floor(columnPair) % 2 === 0) {
      for (let row = qrCodeMatrix.length - 1; row >= 0; row--) {
        if (qrCodeMatrix[row][columnPair * 2 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1] = messageInBinary.charAt(mI) === '0' ? lightColor : darkColor;
          mI++;
          if (mI === messageInBinary.length) return;
        }

        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1] = messageInBinary.charAt(mI) === '0' ? lightColor : darkColor;
          mI++;
          if (mI === messageInBinary.length) return;
        }
      }
    } else {
      for (let row = 0; row <= qrCodeMatrix.length - 1; row++) {
        if (qrCodeMatrix[row][columnPair * 2 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1] = messageInBinary.charAt(mI) === '0' ? lightColor : darkColor;
          mI++;
          if (mI === messageInBinary.length) return;
        }

        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1] = messageInBinary.charAt(mI) === '0' ? lightColor : darkColor;
          mI++;
          if (mI === messageInBinary.length) return;
        }
      }
    }
  }
}

//#endregion data entered

//#region error correction

export function paintModulesForErrorCorrection(
  qrCodeMatrix,
  errorCorrectionBits,
  darkColor = defaultDarkColor,
  lightColor = defaultLightColor
) {
  // TODO fix this function, because there is a column that only includes the timing pattern

  let ecI = 0;
  for (let columnPair = qrCodeMatrix.length / 2; columnPair >= 0; columnPair--) {
    if (Math.floor(columnPair) % 2 === 0) {
      for (let row = qrCodeMatrix.length - 1; row >= 0; row--) {
        if (qrCodeMatrix[row][columnPair * 2 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1] = errorCorrectionBits.charAt(ecI) === '0' ? lightColor : darkColor;
          ecI++;
          if (ecI === errorCorrectionBits.length) return;
        }

        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1] = errorCorrectionBits.charAt(ecI) === '0' ? lightColor : darkColor;
          ecI++;
          if (ecI === errorCorrectionBits.length) return;
        }
      }
    } else {
      for (let row = 0; row <= qrCodeMatrix.length - 1; row++) {
        if (qrCodeMatrix[row][columnPair * 2 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1] = errorCorrectionBits.charAt(ecI) === '0' ? lightColor : darkColor;
          ecI++;
          if (ecI === errorCorrectionBits.length) return;
        }

        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1] = errorCorrectionBits.charAt(ecI) === '0' ? lightColor : darkColor;
          ecI++;
          if (ecI === errorCorrectionBits.length) return;
        }
      }
    }
  }
}

//#endregion error correction

//#region data region

export function paintModulesForDataAndErrorRegion(qrCodeMatrix, bits, darkColor = defaultDarkColor, lightColor = defaultLightColor) {
  if (bits.length === 0) return;

  let moduleIndex = 0;
  let timingPatternOffset = 1;

  for (let columnPair = Math.floor(qrCodeMatrix.length / 2); columnPair >= 0; columnPair--) {
    if (columnPair <= 3) {
      timingPatternOffset = 0;
    }

    if (columnPair % 2 === 0) {
      // the column is filled from bottom to top
      for (let row = qrCodeMatrix.length - 1; row >= 0; row--) {
        if (qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] = bits.charAt(moduleIndex) === '0' ? lightColor : darkColor;
          moduleIndex++;
          if (moduleIndex === bits.length) return;
        }

        if (qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] === DEFAULT_COLOR) {
          qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] = bits.charAt(moduleIndex) === '0' ? lightColor : darkColor;
          moduleIndex++;
          if (moduleIndex === bits.length) return;
        }
      }

      continue;
    }

    // the column is filled from top to bottom
    for (let row = 0; row <= qrCodeMatrix.length - 1; row++) {
      if (qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] === DEFAULT_COLOR) {
        qrCodeMatrix[row][columnPair * 2 - 1 + timingPatternOffset] = bits.charAt(moduleIndex) === '0' ? lightColor : darkColor;
        moduleIndex++;
        if (moduleIndex === bits.length) return;
      }

      if (qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] === DEFAULT_COLOR) {
        qrCodeMatrix[row][columnPair * 2 - 1 - 1 + timingPatternOffset] = bits.charAt(moduleIndex) === '0' ? lightColor : darkColor;
        moduleIndex++;
        if (moduleIndex === bits.length) return;
      }
    }
  }
}

//#endregion data region

// TODO paint modules for data, padding, error bits and padding

// TODO paint mask
