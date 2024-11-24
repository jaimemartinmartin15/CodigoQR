import { MODULE_TYPE } from './module-type';
import { createQrCodeMatrix, paintModules } from './qr-code-matrix';

export const MASKS_FORMULAS = {
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
  // consider modules outside the qr code (margin) as functional
  if (module === undefined) return true;

  return [
    MODULE_TYPE.NOT_DEFINED,
    MODULE_TYPE.POSITION,
    MODULE_TYPE.SEPARATOR,
    MODULE_TYPE.ALIGNMENT,
    MODULE_TYPE.TIMING,
    MODULE_TYPE.VERSION,
    MODULE_TYPE.FORMAT,
  ].includes(module.type);
}

export function applyMask(maskId, qrCodeMatrixWithouMask) {
  const qrCodeMatrixWithMask = createQrCodeMatrix(qrCodeMatrixWithouMask.length);

  for (let i = 0; i < qrCodeMatrixWithMask.length; i++) {
    for (let j = 0; j < qrCodeMatrixWithMask.length; j++) {
      const module = qrCodeMatrixWithouMask[i][j];

      if (isFunctionalModule(module)) continue;

      if (MASKS_FORMULAS[maskId](i, j)) {
        // invert the module
        const invertedModule = module.bit === '0' ? { ...module, bit: '1' } : { ...module, bit: '0' };
        paintModules(qrCodeMatrixWithMask, [[i, j]], invertedModule);
      } else {
        paintModules(qrCodeMatrixWithMask, [[i, j]], module);
      }
    }
  }

  return qrCodeMatrixWithMask;
}

export function evaluateQrCodeAfterMaskApplied(qrCodeMatrix) {
  return (
    evaluateAdjacentModulesSameColor(qrCodeMatrix) +
    evaluate2x2Blocks(qrCodeMatrix) +
    evaluatePresenceOfPattern11311(qrCodeMatrix) +
    evaluateProportionOfDarkModules(qrCodeMatrix)
  );
}

//#region adjacent modules

function evaluateAdjacentModulesSameColor(qrCodeMatrix) {
  const N1 = 3; // as defined in the standard
  let score = 0;
  for (let r = 0; r < qrCodeMatrix.length; r++) {
    for (let c = 0; c < qrCodeMatrix.length; c++) {
      const module = qrCodeMatrix[r][c];

      if (isFunctionalModule(module)) continue;

      // check rows, but if previous module is functional or same color, skip it (already counted)
      if (!isFunctionalModule(qrCodeMatrix[r][c - 1]) && qrCodeMatrix[r][c - 1].bit !== module.bit) {
        let c2 = c;
        let modulesInRInARow = 0;
        while (!isFunctionalModule(qrCodeMatrix[r][c2]) && qrCodeMatrix[r][c2].bit === module.bit) {
          c2++;
          modulesInRInARow++;
        }
        if (modulesInRInARow >= 5) score += N1 + modulesInRInARow - 5;
      }

      // check columns, but if previous module is functional or same color, skip it (already counted)
      if (!isFunctionalModule(qrCodeMatrix[r - 1]?.[c]) && qrCodeMatrix[r - 1][c].bit !== module.bit) {
        let r2 = r;
        let modulesInCInARow = 0;
        while (!isFunctionalModule(qrCodeMatrix[r2]?.[c]) && qrCodeMatrix[r2][c].bit === module.bit) {
          r2++;
          modulesInCInARow++;
        }
        if (modulesInCInARow >= 5) score += N1 + modulesInCInARow - 5;
      }
    }
  }

  return score;
}

//#endregion

//#region blocks 2x2

function evaluate2x2Blocks(qrCodeMatrix) {
  const N2 = 3; // as defined in the standard
  let score = 0;

  for (let r = 0; r < qrCodeMatrix.length - 1; r++) {
    for (let c = 0; c < qrCodeMatrix.length - 1; c++) {
      if (
        isFunctionalModule(qrCodeMatrix[r][c]) ||
        isFunctionalModule(qrCodeMatrix[r][c + 1]) ||
        isFunctionalModule(qrCodeMatrix[r + 1][c]) ||
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

//#endregion

//#region pattern 1:1:3:1:1

function evaluatePresenceOfPattern11311(qrCodeMatrix) {
  const N3 = 40; // as defined in the standard
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

//#endregion

//#region dark proportion

function evaluateProportionOfDarkModules(qrCodeMatrix) {
  const N4 = 10; // as defined in the standard

  let totalModules = 0;
  let darkModules = 0;
  for (let r = 0; r < qrCodeMatrix.length; r++) {
    for (let c = 0; c < qrCodeMatrix.length; c++) {
      const module = qrCodeMatrix[r][c];

      if (isFunctionalModule(module)) continue;

      totalModules++;
      if (module.bit === '1') darkModules++;
    }
  }

  const proportion = Math.trunc((darkModules / totalModules) * 100);

  let deviation = Math.trunc(Math.abs(50 - proportion) / 5);

  return N4 * deviation;
}

//#endregion
