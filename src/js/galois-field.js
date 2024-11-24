export const IRREDUCIBLE_POLYNOMIAL = 0x11d; // (285) x^8 + x^4 + x^3 + x^2 + 1

//#region table generation

// https://codyplanteen.com/assets/rs/gf256_log_antilog.pdf page 3
export const EXPONENTIALS_TABLE = (function () {
  let exponentialsTable = new Array(256);
  let alphaToExponent = 1;
  for (let i = 0; i < 256; i++) {
    exponentialsTable[i] = alphaToExponent;
    alphaToExponent = alphaToExponent * 2;
    if (alphaToExponent >= 256) {
      alphaToExponent = alphaToExponent ^ IRREDUCIBLE_POLYNOMIAL;
    }
  }

  return exponentialsTable;
})();

// https://codyplanteen.com/assets/rs/gf256_log_antilog.pdf page 3
const LOGARITHMS_TABLE = (function createLogarithmsTable() {
  let logarithmsTable = new Array(256);
  for (let i = 0; i < 255; i++) {
    logarithmsTable[EXPONENTIALS_TABLE[i]] = i;
  }
  logarithmsTable[0] = undefined;
  return logarithmsTable;
})();

//#endregion

//#region operations

export function addOrSubtract(a, b) {
  return a ^ b;
}

export function multiply(a, b) {
  if (a == 0 || b == 0) return 0;
  if (a == 1) return b;
  if (b == 1) return a;

  return EXPONENTIALS_TABLE[(LOGARITHMS_TABLE[a] + LOGARITHMS_TABLE[b]) % 255];
}

export function divide(a, b) {
  if (b == 0) throw new Error('divide() cannot divide by zero');
  if (a == 0) return 0;
  if (b == 1) return a;

  return EXPONENTIALS_TABLE[(LOGARITHMS_TABLE[a] - LOGARITHMS_TABLE[b]) % 255];
}

//#endregion
