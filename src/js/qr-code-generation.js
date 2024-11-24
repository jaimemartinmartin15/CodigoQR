import {
  FORMAT_GENERATOR,
  generateBchErrorCorrectionBits,
  showSvgHowBchErrorCorrectionBitsAreCalculated,
  VERSION_GENERATOR,
} from './bch-error-correction-bits';
import {
  alignmentPatternDarkColor,
  alignmentPatternLightColor,
  defaultDarkColor,
  defaultLightColor,
  errorCodewordsDarkColor,
  errorCodewordsLightColor,
  finalModuleColors,
  formatPatternDarkColor,
  formatPatternLightColor,
  messageDarkColor,
  messageLightColor,
  modeDarkColor,
  modeLightColor,
  paddingCodewordDarkColor,
  paddingCodewordLightColor,
  positionPatternDarkColor,
  positionPatternLightColor,
  reminderBitsColor,
  segmentLengthDarkColor,
  segmentLengthLightColor,
  terminatorColor,
  timingPatternDarkColor,
  timingPatternLightColor,
  versionPatternDarkColor,
  versionPatternLightColor,
} from './colors';
import { CSS_CLASSES, CSS_IDS } from './css-selectors';
import { ELEMENTS } from './elements';
import { EXPONENTIALS_TABLE } from './galois-field';
import { applyMask, evaluateQrCodeAfterMaskApplied, MASKS_FORMULAS } from './masking';
import { MODULE_TYPE } from './module-type';
import {
  createQrCodeMatrix,
  paintModules,
  paintModulesForAllAlignmentPatterns,
  paintModulesForAllFormatPatterns,
  paintModulesForAllPositionPatterns,
  paintModulesForAllTimingPatterns,
  paintModulesForAllVersionPatterns,
  paintModulesForDataAndErrorRegion,
} from './qr-code-matrix';
import { QR_CODE_STANDARS } from './qr-code-standards';
import { applyXOR, asciiToBinary, getMessageLengthInBinary, getPaddingCodewords, numberToBinary } from './qr-code-utils';
import { divideBinaryPolinomials, GENERATOR_POLYNOMIALS } from './reed-salomon';
import {
  paintSvgQrCode,
  showFormatPatternCompletion,
  showHowToDivideDataBitStreamInBlocks,
  showVersionPatternCompletion,
} from './svg-painters';
import {
  createMessageToAsciiTable,
  hightlightErrorCorrectionLevelInTable,
  hightlightVersionInVersionsTable,
  hightlightWinnerMaskInTable,
} from './table-handlers';

export function generateQrCode(message, errorCorrectionLevel) {
  //#region determine qr code to use
  /****************************************************************************************************************************************/
  /*                                                    DETERMINE QR CODE TO USE                                                          */
  /****************************************************************************************************************************************/
  const QR_CODE_STANDARD_TO_USE = QR_CODE_STANDARS.find(
    (qr) => qr.errorCorrectionLevel[errorCorrectionLevel].maxMessageLength >= message.length
  );

  if (QR_CODE_STANDARD_TO_USE === undefined) {
    alert('El mensaje es demasiado largo.');
    return;
  }

  console.debug('QR_CODE_STANDARD_TO_USE: ', QR_CODE_STANDARD_TO_USE);
  //#endregion

  //#region version
  /****************************************************************************************************************************************/
  /*                                                                VERSION                                                               */
  /****************************************************************************************************************************************/
  console.debug('%cversion, version pattern modules calculation', 'background: #f99');
  const VERSION_NUMBER_IN_BINARY = numberToBinary(QR_CODE_STANDARD_TO_USE.version, 6);
  console.debug(`VERSION_NUMBER_IN_BINARY (${QR_CODE_STANDARD_TO_USE.version}): ${VERSION_NUMBER_IN_BINARY}`);
  const ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN = generateBchErrorCorrectionBits(VERSION_NUMBER_IN_BINARY, VERSION_GENERATOR);
  console.debug(
    `ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN: ${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN} (length: ${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN.length})`
  );
  const VERSION_PATTERN_ALL_BITS = `${VERSION_NUMBER_IN_BINARY}${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN}`;
  console.debug(`VERSION_PATTERN_ALL_BITS: ${VERSION_PATTERN_ALL_BITS} (length: ${VERSION_PATTERN_ALL_BITS.length})`);
  //#endregion

  //#region format information
  /****************************************************************************************************************************************/
  /*                                                                FORMATS                                                               */
  /****************************************************************************************************************************************/
  console.debug('%cformat information', 'background: #f99');
  const ERROR_CORRECTION_LEVELS_CODIFICATION = { L: '01', M: '00', Q: '11', H: '10' };
  const ERROR_CORRECTION_LEVEL_IN_BINARY = ERROR_CORRECTION_LEVELS_CODIFICATION[errorCorrectionLevel];
  console.debug(`ERROR_CORRECTION_LEVEL_IN_BINARY (${errorCorrectionLevel}): ${ERROR_CORRECTION_LEVEL_IN_BINARY}`);
  const FORMATS_IN_BINARY = Object.keys(MASKS_FORMULAS).map((maskInBinary) => `${ERROR_CORRECTION_LEVEL_IN_BINARY}${maskInBinary}`);
  console.debug(`FORMATS_IN_BINARY:`, FORMATS_IN_BINARY);
  const FORTMAT_PATTERN_MASK = '101010000010010';
  console.debug('FORTMAT_PATTERN_MASK:', FORTMAT_PATTERN_MASK);
  const ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN = FORMATS_IN_BINARY.map((format) => ({
    [format]: generateBchErrorCorrectionBits(format, FORMAT_GENERATOR),
  })).reduce((prev, curr) => ({ ...prev, ...curr }), {});
  console.debug(`ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN:`, ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN);
  const FORMAT_PATTERNS_AFTER_XOR_ALL_BITS = FORMATS_IN_BINARY.map((format) => ({
    [format]: applyXOR(`${format}${ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN[format]}`, FORTMAT_PATTERN_MASK),
  })).reduce((prev, curr) => ({ ...prev, ...curr }), {});
  console.debug(`FORMAT_PATTERNS_AFTER_XOR_ALL_BITS:`, FORMAT_PATTERNS_AFTER_XOR_ALL_BITS);
  //#endregion

  //#region mode and message length
  /****************************************************************************************************************************************/
  /*                                                        MODE AND MESSAGE LENGTH                                                       */
  /****************************************************************************************************************************************/
  console.debug('%cmode and message length', 'background: #f99');
  // in my case always Binary (0100)
  const MODE_BITS = [
    { type: MODULE_TYPE.MODE, bit: '0', letter: '', lightColor: modeLightColor, darkColor: modeDarkColor },
    { type: MODULE_TYPE.MODE, bit: '1', letter: '', lightColor: modeLightColor, darkColor: modeDarkColor },
    { type: MODULE_TYPE.MODE, bit: '0', letter: '', lightColor: modeLightColor, darkColor: modeDarkColor },
    { type: MODULE_TYPE.MODE, bit: '0', letter: '', lightColor: modeLightColor, darkColor: modeDarkColor },
  ];
  const MESSAGE_LENGTH_IN_BINARY = Array.from(getMessageLengthInBinary(QR_CODE_STANDARD_TO_USE.version, message.length)).map((bit) => ({
    type: MODULE_TYPE.SEGMENT_LENGTH,
    bit,
    letter: `${message.length}`,
    lightColor: segmentLengthLightColor,
    darkColor: segmentLengthDarkColor,
  }));
  console.debug(`MODE_BITS:`, MODE_BITS);
  console.debug(`MESSAGE_LENGTH_IN_BINARY (${message.length}):`, MESSAGE_LENGTH_IN_BINARY);
  //#endregion

  //#region message in binary
  /****************************************************************************************************************************************/
  /*                                                           MESSAGE IN BINARY                                                          */
  /****************************************************************************************************************************************/
  console.debug('%cmessage in binary', 'background: #f99');
  const MESSAGE_IN_BINARY = Array.from(asciiToBinary(message)).map((bit, i) => ({
    type: MODULE_TYPE.MESSAGE,
    bit,
    letter: `${message[Math.floor(i / 8)]}${7 - (i % 8)}`,
    lightColor: messageLightColor,
    darkColor: messageDarkColor,
  }));
  console.debug('MESSAGE_IN_BINARY', MESSAGE_IN_BINARY);
  //#endregion

  //#region teminator and padding codewords
  /****************************************************************************************************************************************/
  /*                                                   TERMINATOR AND PADDING CODEWORDS                                                   */
  /****************************************************************************************************************************************/
  console.debug('%cteminator and padding codewords', 'background: #f99');
  // for my use case, terminator is always four 0 bits
  const TERMINATOR = [
    { type: MODULE_TYPE.TERMINATOR, bit: '0', letter: '', lightColor: terminatorColor },
    { type: MODULE_TYPE.TERMINATOR, bit: '0', letter: '', lightColor: terminatorColor },
    { type: MODULE_TYPE.TERMINATOR, bit: '0', letter: '', lightColor: terminatorColor },
    { type: MODULE_TYPE.TERMINATOR, bit: '0', letter: '', lightColor: terminatorColor },
  ];
  console.debug('TERMINATOR:', TERMINATOR);
  const PADDING_CODEWORDS = Array.from(
    getPaddingCodewords(QR_CODE_STANDARD_TO_USE.errorCorrectionLevel[errorCorrectionLevel].maxMessageLength, message.length)
  ).map((bit, i) => ({
    type: MODULE_TYPE.PADDING_CODEWORD,
    bit,
    letter: `p${Math.floor(i / 8) % 2 === 0 ? '1' : '2'}`,
    lightColor: paddingCodewordLightColor,
    darkColor: paddingCodewordDarkColor,
  }));
  console.debug(`PADDING_CODEWORDS (${PADDING_CODEWORDS.length / 8} codewords): `, PADDING_CODEWORDS);
  //#endregion

  //#region bit stream
  /****************************************************************************************************************************************/
  /*                                                              BIT STREAM                                                              */
  /****************************************************************************************************************************************/
  console.debug('%cbit stream', 'background: #f99');
  const DATA_BIT_STREAM = [...MODE_BITS, ...MESSAGE_LENGTH_IN_BINARY, ...MESSAGE_IN_BINARY, ...TERMINATOR, ...PADDING_CODEWORDS];
  console.debug(`DATA_BIT_STREAM (${DATA_BIT_STREAM.length / 8} codewords):`, DATA_BIT_STREAM);
  //#endregion

  //#region create data blocks
  /****************************************************************************************************************************************/
  /*                                                          CREATE DATA BLOCKS                                                          */
  /****************************************************************************************************************************************/
  console.debug('%ccreate data blocks', 'background: #f99');
  const blocksStructure = QR_CODE_STANDARD_TO_USE.errorCorrectionLevel[errorCorrectionLevel].blocksStructure;
  console.debug('blocks structure', blocksStructure);
  const DATA_BLOCKS = [];
  let dataBitStreamCopy = [...DATA_BIT_STREAM];
  blocksStructure.forEach((block) => {
    for (let i = 0; i < block.numberOfBlocks; i++) {
      DATA_BLOCKS.push(dataBitStreamCopy.slice(0, block.dataCodewordsPerBlock * 8));
      dataBitStreamCopy = dataBitStreamCopy.slice(block.dataCodewordsPerBlock * 8);
    }
  });
  console.debug(`DATA_BLOCKS: ${DATA_BLOCKS.length} \n`, DATA_BLOCKS);
  //#endregion

  //#region calculate error correction bits blocks
  /****************************************************************************************************************************************/
  /*                                                CALCULATE ERROR CORRECTION BITS BLOCKS                                                */
  /****************************************************************************************************************************************/
  console.debug('%ccalculate error correction bits blocks', 'background: #f99');
  const alphaExponents = GENERATOR_POLYNOMIALS.find(
    (gp) =>
      gp.numberOfErrorCorrectionCodewords ===
      QR_CODE_STANDARD_TO_USE.errorCorrectionLevel[errorCorrectionLevel].numberOfErrorCorrectionCodewords / DATA_BLOCKS.length
  ).alphaExponents;

  const polynomial = alphaExponents
    .map((ae) => EXPONENTIALS_TABLE[ae])
    .map((v) => numberToBinary(v))
    .join('');
  const ERROR_CORRECTION_BITS_BLOCKS = DATA_BLOCKS.map((block) =>
    divideBinaryPolinomials(block.map((b) => b.bit).join(''), polynomial)
  ).map((block, i) =>
    Array.from(block).map((bit) => ({
      type: MODULE_TYPE.ERROR_CORRECTION,
      bit,
      letter: `E${i + 1}`,
      lightColor: errorCodewordsLightColor,
      darkColor: errorCodewordsDarkColor,
    }))
  );
  console.debug(`ERROR_CORRECTION_BITS_BLOCKS: ${ERROR_CORRECTION_BITS_BLOCKS.length} \n`, ERROR_CORRECTION_BITS_BLOCKS);
  //#endregion

  //#region paint qr code without masking
  /****************************************************************************************************************************************/
  /*                                                    PAINT QR CODE WITHOUT MASKING                                                     */
  /****************************************************************************************************************************************/
  console.debug('%cpaint qr code without masking', 'background: #f99');
  const qrCodeMatrixWithoutMasking = createQrCodeMatrix(QR_CODE_STANDARD_TO_USE.size);

  // functional modules
  paintModulesForAllPositionPatterns(qrCodeMatrixWithoutMasking, finalModuleColors);
  paintModulesForAllAlignmentPatterns(qrCodeMatrixWithoutMasking, finalModuleColors);
  paintModulesForAllTimingPatterns(qrCodeMatrixWithoutMasking, finalModuleColors);
  paintModulesForAllVersionPatterns(qrCodeMatrixWithoutMasking, VERSION_PATTERN_ALL_BITS, finalModuleColors);
  paintModulesForAllFormatPatterns(qrCodeMatrixWithoutMasking, '111111111111111', finalModuleColors); // put mock format until calculated

  // mix data block codewords (including mode, message length, terminator and padding codewords)
  let MIXED_DATA_BLOCKS_STREAM = [];
  for (let codeword = 0; codeword < Math.max(...DATA_BLOCKS.map((b) => b.length / 8)); codeword++) {
    for (let block = 0; block < DATA_BLOCKS.length; block++) {
      if (DATA_BLOCKS[block][codeword * 8] !== undefined)
        MIXED_DATA_BLOCKS_STREAM.push(...DATA_BLOCKS[block].slice(codeword * 8, codeword * 8 + 8));
    }
  }
  console.debug('MIXED_DATA_BLOCKS_STREAM', MIXED_DATA_BLOCKS_STREAM);
  paintModulesForDataAndErrorRegion(
    qrCodeMatrixWithoutMasking,
    MIXED_DATA_BLOCKS_STREAM.map((m) => ({ ...m, ...finalModuleColors }))
  );

  // mix error correction block codewords
  let MIXED_ERROR_CORRECTION_BLOCKS_STREAM = [];
  for (let codeword = 0; codeword < Math.max(...ERROR_CORRECTION_BITS_BLOCKS.map((b) => b.length / 8)); codeword++) {
    for (let block = 0; block < ERROR_CORRECTION_BITS_BLOCKS.length; block++) {
      if (ERROR_CORRECTION_BITS_BLOCKS[block][codeword * 8] !== undefined)
        MIXED_ERROR_CORRECTION_BLOCKS_STREAM.push(...ERROR_CORRECTION_BITS_BLOCKS[block].slice(codeword * 8, codeword * 8 + 8));
    }
  }
  console.debug('MIXED_ERROR_CORRECTION_BLOCKS_STREAM', MIXED_ERROR_CORRECTION_BLOCKS_STREAM);
  paintModulesForDataAndErrorRegion(
    qrCodeMatrixWithoutMasking,
    MIXED_ERROR_CORRECTION_BLOCKS_STREAM.map((m) => ({ ...m, ...finalModuleColors }))
  );

  // remainder bits
  const REMINDER_BITS_STREAM = Array(QR_CODE_STANDARD_TO_USE.reminderBits).fill({
    type: MODULE_TYPE.REMINDER,
    bit: '0',
    lightColor: reminderBitsColor,
  });
  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, REMINDER_BITS_STREAM);
  //#endregion

  //#region apply and evaluate masking
  /****************************************************************************************************************************************/
  /*                                                      APPLY AND EVALUATE MASKING                                                      */
  /****************************************************************************************************************************************/
  console.debug('%capply and evaluate masking', 'background: #f99');
  const QR_CODES_WITH_MASK_APPLIED = Object.keys(MASKS_FORMULAS).reduce(
    (prev, maskId) => ({ ...prev, [maskId]: applyMask(maskId, qrCodeMatrixWithoutMasking) }),
    {}
  );

  const MASK_SCORES = Object.entries(QR_CODES_WITH_MASK_APPLIED).reduce(
    (prev, [maskId, qrCodeMatrixWithMask]) => ({ ...prev, [maskId]: evaluateQrCodeAfterMaskApplied(qrCodeMatrixWithMask) }),
    {}
  );
  console.debug('MASK_SCORES', MASK_SCORES);

  // choose the one with less score
  const MASK_APPLIED = Object.keys(MASK_SCORES).reduce((maskA, maskB) => (MASK_SCORES[maskA] < MASK_SCORES[maskB] ? maskA : maskB));
  console.debug(`MASK_APPLIED: ${MASK_APPLIED}`);
  //#endregion

  //#region paint final qr code
  /****************************************************************************************************************************************/
  /*                                                         PAINT FINAL QR CODE                                                          */
  /****************************************************************************************************************************************/
  paintModulesForAllPositionPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], {
    lightColor: defaultLightColor,
    darkColor: defaultDarkColor,
  });
  paintModulesForAllAlignmentPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], {
    lightColor: defaultLightColor,
    darkColor: defaultDarkColor,
  });
  paintModulesForAllTimingPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], {
    lightColor: defaultLightColor,
    darkColor: defaultDarkColor,
  });
  paintModulesForAllVersionPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], VERSION_PATTERN_ALL_BITS, {
    lightColor: defaultLightColor,
    darkColor: defaultDarkColor,
  });
  paintModulesForAllFormatPatterns(
    QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED],
    FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`],
    {
      lightColor: defaultLightColor,
      darkColor: defaultDarkColor,
    }
  );
  setTimeout(() => paintSvgQrCode(CSS_IDS.SVG_FINAL_QR_CODE, QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], { withGrid: false, margin: 4 }));
  //#endregion

  //#region paint empty qr code
  /****************************************************************************************************************************************/
  /*                                                         PAINT EMPTY QR CODE                                                          */
  /****************************************************************************************************************************************/
  const emptyQrCodeMatrix = createQrCodeMatrix(QR_CODE_STANDARD_TO_USE.size);
  setTimeout(() => paintSvgQrCode(CSS_IDS.SVG_EMPTY_QR_CODE, emptyQrCodeMatrix));
  //#endregion

  //#region decide size of qr code step explanation
  /****************************************************************************************************************************************/
  /*                                               DECIDE SIZE OF QR CODE STEP EXPLANATION                                                */
  /****************************************************************************************************************************************/
  // number of characters to codify in the qr code
  document.querySelectorAll(CSS_CLASSES.NUMBER_OF_CHARACTERS_IN_THE_INPUT).forEach((e) => (e.textContent = message.length));
  // selected error capacity
  document.querySelectorAll(CSS_CLASSES.SELECTED_ERROR_CORRECTION_LEVEL).forEach((e) => (e.textContent = errorCorrectionLevel));
  // highlight the row in the table
  hightlightVersionInVersionsTable(QR_CODE_STANDARD_TO_USE.version, errorCorrectionLevel);
  //#endregion

  //#region qr code sections
  /****************************************************************************************************************************************/
  /*                                                          QR CODE SECTIONS                                                            */
  /****************************************************************************************************************************************/
  // paint matrix and svg qr code sections
  const sectionsQrCodeMatrix = createQrCodeMatrix(QR_CODE_STANDARD_TO_USE.size);
  paintModulesForAllPositionPatterns(sectionsQrCodeMatrix, { darkColor: positionPatternDarkColor, lightColor: positionPatternLightColor });
  paintModulesForAllAlignmentPatterns(sectionsQrCodeMatrix, {
    darkColor: alignmentPatternDarkColor,
    lightColor: alignmentPatternLightColor,
  });
  paintModulesForAllTimingPatterns(sectionsQrCodeMatrix, { darkColor: timingPatternDarkColor, lightColor: timingPatternLightColor });
  paintModulesForAllVersionPatterns(sectionsQrCodeMatrix, VERSION_PATTERN_ALL_BITS, {
    darkColor: versionPatternDarkColor,
    lightColor: versionPatternLightColor,
  });
  paintModulesForAllFormatPatterns(
    sectionsQrCodeMatrix,
    FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`],
    {
      darkColor: formatPatternDarkColor,
      lightColor: formatPatternLightColor,
    }
  );
  paintModules(sectionsQrCodeMatrix, [[sectionsQrCodeMatrix.length - 8, 8]], {
    darkColor: defaultDarkColor,
    lightColor: defaultDarkColor,
  });
  setTimeout(() => paintSvgQrCode(CSS_IDS.SVG_SECTIONS_QR_CODE, sectionsQrCodeMatrix, { withGrid: true, margin: 3 }));

  // alignment patterns
  if (QR_CODE_STANDARD_TO_USE.alignmentPatternPositions.length === 0) {
    ELEMENTS.ALIGNMENT_PATTERNS_DESCRIPTION.innerHTML = 'no se necesitan';
  } else if (QR_CODE_STANDARD_TO_USE.alignmentPatternPositions.length === 1) {
    ELEMENTS.ALIGNMENT_PATTERNS_DESCRIPTION.innerHTML = `se necesita <strong>1 patrón</strong> en la fila y columna <strong>${
      QR_CODE_STANDARD_TO_USE.alignmentPatternPositions[0] + 3
    }</strong>`;
  } else {
    ELEMENTS.ALIGNMENT_PATTERNS_DESCRIPTION.innerHTML = `se necesitan <strong>${
      Math.pow(QR_CODE_STANDARD_TO_USE.alignmentPatternPositions.length, 2) - 3
    } patrones</strong> en las filas y columnas <strong>${new Intl.ListFormat('es', { style: 'long', type: 'conjunction' }).format(
      QR_CODE_STANDARD_TO_USE.alignmentPatternPositions.map((p) => `${p + 3}`)
    )}</strong>`;
  }

  // version pattern
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION)).forEach((e) => (e.textContent = QR_CODE_STANDARD_TO_USE.version));
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = VERSION_NUMBER_IN_BINARY));
  showSvgHowBchErrorCorrectionBitsAreCalculated(
    CSS_IDS.CALCULATION_OF_VERSION_CORRECTION_BITS,
    VERSION_NUMBER_IN_BINARY,
    VERSION_GENERATOR
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = VERSION_NUMBER_IN_BINARY));
  Array.from(document.querySelectorAll(CSS_CLASSES.VERSION_CORRECTION_BITS)).forEach(
    (e) => (e.textContent = ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN)
  );
  showVersionPatternCompletion(VERSION_PATTERN_ALL_BITS);

  // format pattern
  hightlightErrorCorrectionLevelInTable(errorCorrectionLevel);
  hightlightWinnerMaskInTable(MASK_APPLIED);
  Array.from(document.querySelectorAll(CSS_CLASSES.ERROR_CORRECTION_LEVEL_BINARY)).forEach(
    (e) => (e.innerHTML = ERROR_CORRECTION_LEVEL_IN_BINARY)
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.MASK_CODIFICATION_BITS)).forEach((e) => (e.innerHTML = MASK_APPLIED));
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_BITS)).forEach(
    (e) => (e.innerHTML = `${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`)
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_CORRECTION_BITS)).forEach(
    (e) => (e.innerHTML = ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`])
  );
  showSvgHowBchErrorCorrectionBitsAreCalculated(
    CSS_IDS.CALCULATION_OF_FORMAT_CORRECTION_BITS,
    `${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`,
    FORMAT_GENERATOR
  );
  document.querySelector(CSS_IDS.FORMAT_15_BITS_AFTER_XOR).textContent =
    FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`];
  showFormatPatternCompletion(FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`]);
  //#endregion

  //#region data modules and blocks
  /****************************************************************************************************************************************/
  /*                                                      DATA MODULES AND BLOCKS                                                         */
  /****************************************************************************************************************************************/
  createMessageToAsciiTable(message);
  showHowToDivideDataBitStreamInBlocks(DATA_BLOCKS);
  //#endregion

  //#region paint data, error and reminder qr code explanation
  /****************************************************************************************************************************************/
  /*                                       PAINT DATA, ERROR AND REMINDER QR CODE EXPLANATION                                             */
  /****************************************************************************************************************************************/
  const qrCodeWithOnlyData = createQrCodeMatrix(QR_CODE_STANDARD_TO_USE.size);
  paintModulesForAllPositionPatterns(qrCodeWithOnlyData, finalModuleColors);
  paintModulesForAllAlignmentPatterns(qrCodeWithOnlyData, finalModuleColors);
  paintModulesForAllTimingPatterns(qrCodeWithOnlyData, finalModuleColors);
  paintModulesForAllVersionPatterns(qrCodeWithOnlyData, VERSION_PATTERN_ALL_BITS, finalModuleColors);
  paintModulesForAllFormatPatterns(
    qrCodeWithOnlyData,
    FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`],
    finalModuleColors
  );
  paintModulesForDataAndErrorRegion(qrCodeWithOnlyData, [
    ...MIXED_DATA_BLOCKS_STREAM,
    ...MIXED_ERROR_CORRECTION_BLOCKS_STREAM,
    ...REMINDER_BITS_STREAM,
  ]);

  setTimeout(() => paintSvgQrCode(CSS_IDS.SVG_DATA_REGION_EXPLAINED_QR_CODE, qrCodeWithOnlyData, { labels: true }));
  //#endregion

  //#region masks section
  /****************************************************************************************************************************************/
  /*                                                         MASKS SECTION                                                                */
  /****************************************************************************************************************************************/
  Object.keys(MASKS_FORMULAS).forEach((maskId) => {
    const qrCodeMatrix = createQrCodeMatrix(QR_CODE_STANDARD_TO_USE.size);

    paintModulesForAllPositionPatterns(qrCodeMatrix, { lightColor: defaultLightColor, darkColor: defaultLightColor });
    paintModulesForAllAlignmentPatterns(qrCodeMatrix, { lightColor: defaultLightColor, darkColor: defaultLightColor });
    paintModulesForAllTimingPatterns(qrCodeMatrix, { lightColor: defaultLightColor, darkColor: defaultLightColor });
    paintModulesForAllVersionPatterns(qrCodeMatrix, VERSION_PATTERN_ALL_BITS, {
      lightColor: defaultLightColor,
      darkColor: defaultLightColor,
    });
    paintModulesForAllFormatPatterns(
      qrCodeMatrix,
      FORMAT_PATTERNS_AFTER_XOR_ALL_BITS[`${ERROR_CORRECTION_LEVEL_IN_BINARY}${MASK_APPLIED}`],
      {
        lightColor: defaultLightColor,
        darkColor: defaultLightColor,
      }
    );

    for (let row = 0; row < qrCodeMatrix.length; row++) {
      for (let column = 0; column < qrCodeMatrix.length; column++) {
        if (qrCodeMatrix[row][column].type === MODULE_TYPE.NOT_DEFINED) {
          qrCodeMatrix[row][column].type = MODULE_TYPE.MASK;
          qrCodeMatrix[row][column].bit = '0';
          qrCodeMatrix[row][column].lightColor = defaultLightColor;
          qrCodeMatrix[row][column].darkColor = defaultDarkColor;
        }
      }
    }

    const maskPatternMatrix = applyMask(maskId, qrCodeMatrix);
    setTimeout(() => paintSvgQrCode(`${CSS_IDS.SVG_MASK_QR_CODE(maskId)}`, maskPatternMatrix, { withGrid: false }));
  });
  //#endregion
}
