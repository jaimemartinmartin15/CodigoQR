import { MODULE_TYPE } from './module-type';
import { createQrCodeMatrix, paintModules } from './qr-code-matrix';

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

function isFunctionalModule(module) {
  return [MODULE_TYPE.POSITION, MODULE_TYPE.ALIGNMENT, MODULE_TYPE.TIMING, MODULE_TYPE.VERSION, MODULE_TYPE.FORMAT].includes(module.type);
}

export function applyMask(maskId, qrCodeMatrix) {
  const qrCodeWithMask = createQrCodeMatrix(qrCodeMatrix.length);

  for (let i = 0; i < qrCodeWithMask.length; i++) {
    for (let j = 0; j < qrCodeWithMask.length; j++) {
      if (isFunctionalModule(qrCodeMatrix[i][j])) continue;

      if (DATA_MASKS_PATTERNS[maskId](i, j)) {
        const moduleToInvert = qrCodeMatrix[i][j];
        const invertedModule = moduleToInvert.bit === '0' ? { ...moduleToInvert, bit: '1' } : { ...moduleToInvert, bit: '0' };
        paintModules(qrCodeWithMask, [[i, j]], invertedModule);
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
      if (isFunctionalModule(qrCodeMatrix[r][c])) continue;

      // check rows but if previous module is same color, it was already counted
      if (qrCodeMatrix[r][c - 1] === undefined || qrCodeMatrix[r][c - 1].bit !== qrCodeMatrix[r][c].bit) {
        let k = c;
        let modulesInRInARow = 0;
        while (
          qrCodeMatrix[r][k] !== undefined &&
          !isFunctionalModule(qrCodeMatrix[r][k]) &&
          qrCodeMatrix[r][c].bit === qrCodeMatrix[r][k].bit
        ) {
          k++;
          modulesInRInARow++;
        }
        if (modulesInRInARow >= 5) score += N1 + modulesInRInARow - 5;
      }

      // check columns but if previous module is same color, it was already counted
      if (qrCodeMatrix[r - 1]?.[c] === undefined || qrCodeMatrix[r - 1][c].bit !== qrCodeMatrix[r][c].bit) {
        let k = r;
        let modulesInCInARow = 0;
        while (
          qrCodeMatrix[k]?.[c] !== undefined &&
          !isFunctionalModule(qrCodeMatrix[k][c]) &&
          qrCodeMatrix[r][c].bit === qrCodeMatrix[k][c].bit
        ) {
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
      if (
        isFunctionalModule(qrCodeMatrix[r][c]) &&
        qrCodeMatrix[r][c + 1] !== undefined &&
        isFunctionalModule(qrCodeMatrix[r][c + 1]) &&
        qrCodeMatrix[r + 1][c] !== undefined &&
        isFunctionalModule(qrCodeMatrix[r + 1][c]) &&
        qrCodeMatrix[r + 1][c + 1] !== undefined &&
        isFunctionalModule(qrCodeMatrix[r + 1][c + 1])
      )
        continue;

      const bit00 = qrCodeMatrix[r][c].bit;
      const bit01 = qrCodeMatrix[r][c + 1].bit;
      const bit10 = qrCodeMatrix[r + 1][c].bit;
      const bit11 = qrCodeMatrix[r + 1][c + 1].bit;

      if ([bit00, bit01, bit10, bit11].every((bit, _, arr) => bit === arr[0])) score++;
    }
  }

  return N2 * score;
}

function evaluatePresenceOfPattern11311(qrCodeMatrix) {
  const N3 = 40;
  const PATTERN = ['1', '0', '1', '1', '1', '0', '1'];

  for (let r = 0; r < qrCodeMatrix.length - 6; r++) {
    for (let c = 0; c < qrCodeMatrix.length - 6; c++) {
      if (isFunctionalModule(qrCodeMatrix[r][c])) continue;

      //#region 1:1:3:1:1 pattern in row
      let isRowPatternMatch = true;
      for (let i = 0; i < PATTERN.length; i++) {
        if (isFunctionalModule(qrCodeMatrix[r][c + i]) || qrCodeMatrix[r][c + i].bit !== PATTERN[i]) {
          isRowPatternMatch = false;
          break;
        }
      }
      if (isRowPatternMatch) {
        // check also it is preceded or followed by four white modules
        let isPreceded = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r][c - i] === undefined) return N3;
          if (qrCodeMatrix[r][c - i].bit !== '0') {
            isPreceded = false;
            break;
          }
        }
        if (isPreceded) return N3;

        let isFollowed = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r][c + 6 + i] === undefined) return N3;
          if (qrCodeMatrix[r][c + 6 + i].bit !== '0') {
            isFollowed = false;
            break;
          }
        }
        if (isFollowed) return N3;
      }
      //#endregion

      //#region 1:1:3:1:1 pattern in column
      let isColumnPatternMatch = true;
      for (let i = 0; i < PATTERN.length; i++) {
        if (isFunctionalModule(qrCodeMatrix[r + i][c]) || qrCodeMatrix[r + i][c].bit !== PATTERN[i]) {
          isColumnPatternMatch = false;
          break;
        }
      }
      if (isColumnPatternMatch) {
        // check also it is preceded or followed by four white modules
        let isPreceded = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r - i]?.[c] === undefined) return N3;
          if (qrCodeMatrix[r - i]?.[c].bit !== '0') {
            isPreceded = false;
            break;
          }
        }
        if (isPreceded) return N3;

        let isFollowed = true;
        for (let i = 1; i <= 4; i++) {
          if (qrCodeMatrix[r + 6 + i]?.[c] === undefined) return N3;
          if (qrCodeMatrix[r + 6 + i]?.[c].bit !== '0') {
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
      if (isFunctionalModule(qrCodeMatrix[r][c])) continue;

      totalModules++;
      if (qrCodeMatrix[r][c].bit === '1') darkModules++;
    }
  }

  const proportion = Math.trunc((darkModules / totalModules) * 100);

  let deviation = Math.trunc(Math.abs(50 - proportion) / 5);

  return N4 * deviation;
}
