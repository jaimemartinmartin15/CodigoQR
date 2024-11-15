import { DEFAULT_COLOR, defaultDarkColor, defaultLightColor } from './colors';
import { createQrCodeMatrix, paintModules } from './qr-code-utils';

export const EXCLUDE_FROM_MASK_COLOR = 'blue';

export const DATA_MASKS_PATTERNS = {
  '000': (i, j) => (i + j) % 2 === 0,
  '001': (i, _) => i % 2 === 0,
  '010': (_, j) => j % 3 === 0,
  '011': (i, j) => (i + j) % 3 === 0,
  100: (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  101: (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  110: (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  111: (i, j) => (((i + j) % 2) + ((i * j) % 3)) % 2 === 0,
};

export function applyMask(maskId, qrCodeMatrix) {
  const qrCodeWithMask = createQrCodeMatrix(qrCodeMatrix.length);

  for (let i = 0; i < qrCodeWithMask.length; i++) {
    for (let j = 0; j < qrCodeWithMask.length; j++) {
      if (qrCodeMatrix[i][j] === EXCLUDE_FROM_MASK_COLOR) continue;

      if (DATA_MASKS_PATTERNS[maskId](i, j)) {
        // invert the module color
        const color = qrCodeMatrix[i][j] === defaultDarkColor ? defaultLightColor : defaultDarkColor;
        paintModules(qrCodeWithMask, [[i, j]], color);
      } else {
        paintModules(qrCodeWithMask, [[i, j]], qrCodeMatrix[i][j]);
      }
    }
  }

  return qrCodeWithMask;
}

export function evaluateQrCodeAfterMaskApplied(qrCodeMatrix) {
  return (
    evaluateAdjacentModulesSameColor(qrCodeMatrix) +
    evaluate2x2Blocks(qrCodeMatrix) +
    evaluatePresenceOfPattern11311(qrCodeMatrix) +
    evaluateProportionOfDarkModules(qrCodeMatrix)
  );
}

function evaluateAdjacentModulesSameColor(qrCodeMatrix) {
  const N1 = 3;
  let score = 0;

  for (let r = 0; r < qrCodeMatrix.length; r++) {
    for (let c = 0; c < qrCodeMatrix.length; c++) {
      if (qrCodeMatrix[r][c] === DEFAULT_COLOR) continue;

      // check rows but if previous module is same color, it was already counted
      if (qrCodeMatrix[r][c - 1] !== qrCodeMatrix[r][c]) {
        let k = c;
        let modulesInRInARow = 0;
        while (qrCodeMatrix[r][c] === qrCodeMatrix[r][k]) {
          k++;
          modulesInRInARow++;
        }
        if (modulesInRInARow >= 5) score += N1 + modulesInRInARow - 5;
      }

      // check columns but if previous module is same color, it was already counted
      if (qrCodeMatrix[r - 1]?.[c] === undefined || qrCodeMatrix[r - 1][c] !== qrCodeMatrix[r][c]) {
        let k = r;
        let modulesInCInARow = 0;
        while (qrCodeMatrix[r][c] === qrCodeMatrix[k]?.[c]) {
          k++;
          modulesInCInARow++;
        }
        if (modulesInCInARow >= 5) score += N1 + modulesInCInARow - 5;
      }
    }
  }

  return score;
}

function evaluate2x2Blocks(qrCodeMatrix) {
  const N2 = 3;
  let score = 0;

  for (let r = 0; r < qrCodeMatrix.length - 1; r++) {
    for (let c = 0; c < qrCodeMatrix.length - 1; c++) {
      if (qrCodeMatrix[r][c] === DEFAULT_COLOR) continue;

      const color00 = qrCodeMatrix[r][c];
      const color01 = qrCodeMatrix[r][c + 1];
      const color10 = qrCodeMatrix[r + 1][c];
      const color11 = qrCodeMatrix[r + 1][c + 1];

      if (color00 === color01 && color00 === color10 && color00 === color11) score++;
    }
  }

  return N2 * score;
}

function evaluatePresenceOfPattern11311(qrCodeMatrix) {
  const N3 = 40;
  const PATTERN = [
    defaultDarkColor,
    defaultLightColor,
    defaultDarkColor,
    defaultDarkColor,
    defaultDarkColor,
    defaultLightColor,
    defaultDarkColor,
  ];

  for (let r = 0; r < qrCodeMatrix.length - 6; r++) {
    for (let c = 0; c < qrCodeMatrix.length - 6; c++) {
      if (qrCodeMatrix[r][c] === DEFAULT_COLOR) continue;

      //#region 1:1:3:1:1 pattern in row
      let isRowPaternMatch = true;
      for (let i = 0; i < PATTERN.length; i++) {
        if (qrCodeMatrix[r][c + i] !== PATTERN[i]) {
          isRowPaternMatch = false;
          break;
        }
      }
      if (isRowPaternMatch) {
        // check also it is preceded or followed by four white modules
        let isPreceded = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r][c - i] === undefined) return N3;
          if (qrCodeMatrix[r][c - i] !== defaultLightColor) {
            isPreceded = false;
            break;
          }
        }
        if (isPreceded) return N3;

        let isFollowed = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r][c + 6 + i] === undefined) return N3;
          if (qrCodeMatrix[r][c + 6 + i] !== defaultLightColor) {
            isFollowed = false;
            break;
          }
        }
        if (isFollowed) return N3;
      }
      //#endregion

      //#region 1:1:3:1:1 pattern in column
      let isColumnPaternMatch = true;
      for (let i = 0; i < PATTERN.length; i++) {
        if (qrCodeMatrix[r + i][c] !== PATTERN[i]) {
          isColumnPaternMatch = false;
          break;
        }
      }
      if (isColumnPaternMatch) {
        // check also it is preceded or followed by four white modules
        let isPreceded = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r - i]?.[c] === undefined) return N3;
          if (qrCodeMatrix[r - i]?.[c] !== defaultLightColor) {
            isPreceded = false;
            break;
          }
        }
        if (isPreceded) return N3;

        let isFollowed = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r + 6 + i]?.[c] === undefined) return N3;
          if (qrCodeMatrix[r + 6 + i]?.[c] !== defaultLightColor) {
            isFollowed = false;
            break;
          }
        }
        if (isFollowed) return N3;
      }
      //#endregion
    }
  }

  return 0;
}

function evaluateProportionOfDarkModules(qrCodeMatrix) {
  const N4 = 10;

  let totalModules = 0;
  let darkModules = 0;
  for (let r = 0; r < qrCodeMatrix.length; r++) {
    for (let c = 0; c < qrCodeMatrix.length; c++) {
      if (qrCodeMatrix[r][c] === DEFAULT_COLOR) continue;

      totalModules++;
      if (qrCodeMatrix[r][c] === defaultDarkColor) darkModules++;
    }
  }

  const proportion = Math.trunc((darkModules / totalModules) * 100);

  let deviation = Math.trunc(Math.abs(50 - proportion) / 5);

  return N4 * deviation;
}
