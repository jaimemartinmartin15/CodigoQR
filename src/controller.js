import {
  calculateCorrectionBitsForFormat,
  calculateCorrectionBitsForVersion,
  calculateErrorCorrectionBitsForDataEntered,
  showFormatPatternCompletion,
  showHowFormatCorrectionBitsAreCalculated,
  showHowVersionCorrectionBitsAreCalculated,
  showVersionPatternCompletion,
} from './calculation-of-correction-bits';
import {
  alignmentPatternDarkColor,
  alignmentPatternLightColor,
  dataCodificationFormatDarkColor,
  dataCodificationFormatLightColor,
  dataEnteredDarkColor,
  dataEnteredLightColor,
  defaultDarkColor,
  errorCodewordsDarkColor,
  errorCodewordsLightColor,
  formatInformationDarkColor,
  formatInformationLightColor,
  numberOfCharactersEnteredDarkColor,
  numberOfCharactersEnteredLightColor,
  padCodewordDarkColor,
  padCodewordLightColor,
  positionPatternDarkColor,
  positionPatternLightColor,
  timingPatternDarkColor,
  timingPatternLightColor,
  versionInformationDarkColor,
  versionInformationLightColor,
} from './colors';
import { CSS_CLASSES, CSS_IDS } from './css-selectors';
import { ELEMENTS } from './elements';
import { EXPONENTIALS_TABLE } from './galois-field';
import { applyMask, DATA_MASKS_PATTERNS, evaluateQrCodeAfterMaskApplied, EXCLUDE_FROM_MASK_COLOR } from './masking';
import { QR_CODE_INFO } from './qr-code-info';
import {
  paintModulesForAllAlignmentPatterns,
  paintModulesForAllFormatPatterns,
  paintModulesForAllPositionPatterns,
  paintModulesForAllTimingPatterns,
  paintModulesForAllVersionPatterns,
  paintModulesForDataAndErrorRegion,
} from './qr-code-painters';
import {
  applyXOR,
  asciiToBinary,
  createQrCodeMatrix,
  getMessageLengthAsBinary,
  getPaddingCodewords,
  numberToBinary,
  paintModules,
  paintSvgQrCode,
  splitInBytes,
} from './qr-code-utils';
import { divideBinaryPolinomials, GENERATOR_POLYNOMIALS } from './reed-salomon';
import {
  createAlignmentPatternsTable,
  createVersionsTable,
  hightlightVersionInAlignmentPatternsTable,
  hightlightVersionInVersionsTable,
} from './table-handlers';

createVersionsTable();
createAlignmentPatternsTable();

//#region listener-create-qr-code

function readInputs() {
  // read inputs and create the qr code for the MESSAGE and ERROR CAPACITY selected
  const input = document.querySelector('textarea');
  const message = input.value || input.placeholder;
  const errorCapacity = Array.from(document.querySelectorAll('input[type="radio"][name="ECC"]')).find((r) => r.checked).value;
  return { message, errorCapacity };
}

ELEMENTS.GENERATE_QR_CODE_BUTTON.addEventListener('click', () => {
  const { message, errorCapacity } = readInputs();
  generateQrCode2(message, errorCapacity);
});

function generateQrCode(message, errorCapacity) {
  const qrCodeVersion = QR_CODE_INFO.find((qr) => qr.errorCapacity[errorCapacity] >= message.length);

  const versionInBinary = (qrCodeVersion.version >>> 0).toString(2).padStart(6, '0');
  const errorCorrectionBitsVersionPattern = calculateCorrectionBitsForVersion(versionInBinary);

  const ERROR_CAPACITY_CODIFICATION = { L: '01', M: '00', Q: '11', H: '10' };
  const errorCapacityCodificationBits = ERROR_CAPACITY_CODIFICATION[errorCapacity];
  const maskCodificationBits = '010'; // TODO calculate the mask code
  const formatDataInBinary = `${errorCapacityCodificationBits}${maskCodificationBits}`;
  const formatCorrectionBits = calculateCorrectionBitsForFormat(formatDataInBinary);
  const formatBitsAfterXor = applyXOR(`${formatDataInBinary}${formatCorrectionBits}`, '101010000010010');

  // Print final qr code version
  const generatedFinalQrCodeMatrix = createQrCodeMatrix(qrCodeVersion.size);
  paintModulesForAllPositionPatterns(generatedFinalQrCodeMatrix);
  paintModulesForAllAlignmentPatterns(generatedFinalQrCodeMatrix);
  paintModulesForAllTimingPatterns(generatedFinalQrCodeMatrix);
  paintModulesForAllVersionPatterns(generatedFinalQrCodeMatrix, `${versionInBinary}${errorCorrectionBitsVersionPattern}`);
  paintModulesForAllFormatPatterns(generatedFinalQrCodeMatrix, formatBitsAfterXor);
  paintSvgQrCode(CSS_IDS.GENERATED_FINAL_QR_CODE, generatedFinalQrCodeMatrix, { withGrid: false, margin: 0 });

  // Show empty qr code
  const emptyQrCodeMatrix = createQrCodeMatrix(qrCodeVersion.size);
  paintSvgQrCode(CSS_IDS.EMPTY_QR_CODE, emptyQrCodeMatrix);

  // Set the number of characters to codify in the qr code
  document.querySelectorAll(CSS_CLASSES.NUMBER_OF_CHARACTERS_IN_THE_INPUT).forEach((e) => (e.textContent = message.length));

  // Set the selected error capacity
  document.querySelectorAll(CSS_CLASSES.SELECTED_ERROR_CAPACITY_LEVEL).forEach((e) => (e.textContent = errorCapacity));

  hightlightVersionInVersionsTable(qrCodeVersion.version, errorCapacity);
  hightlightVersionInAlignmentPatternsTable(qrCodeVersion.version);

  // Show qr code sections
  const sectionsQrCodeMatrix = createQrCodeMatrix(qrCodeVersion.size);
  paintModulesForAllPositionPatterns(sectionsQrCodeMatrix, positionPatternDarkColor, positionPatternLightColor);
  paintModulesForAllAlignmentPatterns(sectionsQrCodeMatrix, alignmentPatternDarkColor, alignmentPatternLightColor);
  paintModulesForAllTimingPatterns(sectionsQrCodeMatrix, timingPatternDarkColor, timingPatternLightColor);
  paintModulesForAllVersionPatterns(
    sectionsQrCodeMatrix,
    `${versionInBinary}${errorCorrectionBitsVersionPattern}`,
    versionInformationDarkColor,
    versionInformationLightColor
  );
  paintModulesForAllFormatPatterns(sectionsQrCodeMatrix, formatBitsAfterXor, formatInformationDarkColor, formatInformationLightColor);
  paintSvgQrCode(CSS_IDS.QR_CODE_SECTIONS, sectionsQrCodeMatrix, { withGrid: true, margin: 3 });

  // Explanation version information
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION)).forEach((e) => (e.textContent = qrCodeVersion.version));
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = versionInBinary));
  showHowVersionCorrectionBitsAreCalculated(versionInBinary);
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = versionInBinary));
  Array.from(document.querySelectorAll(CSS_CLASSES.VERSION_CORRECTION_BITS)).forEach(
    (e) => (e.textContent = errorCorrectionBitsVersionPattern)
  );
  showVersionPatternCompletion(`${versionInBinary}${errorCorrectionBitsVersionPattern}`);

  // Explanation format information
  Array.from(document.querySelectorAll(CSS_CLASSES.ERROR_CAPACITY_CODIFICATION_BITS)).forEach(
    (e) => (e.innerHTML = errorCapacityCodificationBits)
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.MASK_CODIFICATION_BITS)).forEach((e) => (e.innerHTML = maskCodificationBits));
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_INFORMATION_DATA_BITS)).forEach((e) => (e.innerHTML = formatDataInBinary));
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_INFORMATION_CORRECTION_BITS)).forEach(
    (e) => (e.innerHTML = formatCorrectionBits)
  );
  showHowFormatCorrectionBitsAreCalculated(formatDataInBinary);
  document.querySelector(CSS_IDS.INFORMATION_FORMAT_15_BITS_AFTER_XOR).textContent = formatBitsAfterXor;
  showFormatPatternCompletion(formatBitsAfterXor);

  // convert message to ascii
  ELEMENTS.ASCII_MESSAGE_TABLE.innerHTML = '';
  for (let i = 0; i < message.length; i++) {
    const div = document.createElement('div');
    div.classList.add('element');

    const letter = document.createElement('div');
    letter.textContent = message[i];

    const codification = document.createElement('div');
    codification.textContent = `${message.charCodeAt(i)} = ${(+message.charCodeAt(i) >>> 0).toString(2).padStart(8, '0')}`;
    codification.classList.add('monospace');

    div.append(letter);
    div.append(codification);
    ELEMENTS.ASCII_MESSAGE_TABLE.append(div);
  }

  // Show how to enter data
  const howToEnterDataExplanationMatrix = createQrCodeMatrix(qrCodeVersion.size);
  paintModulesForAllPositionPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllAlignmentPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllTimingPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllVersionPatterns(
    howToEnterDataExplanationMatrix,
    `${versionInBinary}${errorCorrectionBitsVersionPattern}`,
    defaultDarkColor,
    '#666'
  );
  paintModulesForAllFormatPatterns(howToEnterDataExplanationMatrix, formatBitsAfterXor);
  // mode (data codification format, always binary in my case)
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    '0100',
    dataCodificationFormatDarkColor,
    dataCodificationFormatLightColor
  );
  // message length
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    getMessageLengthAsBinary(qrCodeVersion.version, message.length),
    numberOfCharactersEnteredDarkColor,
    numberOfCharactersEnteredLightColor
  );
  // paint the data
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, asciiToBinary(message), dataEnteredDarkColor, dataEnteredLightColor);
  // padding bits (in my case always 4 modules)
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, '0000');
  // padding codewords
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    getPaddingCodewords(qrCodeVersion, errorCapacity, message.length),
    padCodewordDarkColor,
    padCodewordLightColor
  );
  // error correction modules
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    calculateErrorCorrectionBitsForDataEntered(message, qrCodeVersion, errorCapacity),
    errorCodewordsDarkColor,
    errorCodewordsLightColor
  );
  // reminder bits for qr code symbol (max 7 modules)
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, '0000000', undefined, 'navajowhite');
  paintSvgQrCode(CSS_IDS.HOW_TO_ENTER_DATA_EXPLANATION, howToEnterDataExplanationMatrix);

  console.log(howToEnterDataExplanationMatrix);
}

// create the default qr code with the input placeholder
const { message, errorCapacity } = readInputs();
// generateQrCode(message, errorCapacity);

//#endregion listener-create-qr-code

function generateQrCode2(message, errorCorrectionLevel) {
  const QR_CODE_INFO_TO_USE = QR_CODE_INFO.find((qr) => qr.errorCorrectionLevel[errorCorrectionLevel].maxMessageLength >= message.length);

  if (QR_CODE_INFO_TO_USE === null) {
    // TODO check it is possible to encode the data in a qr code, or if it is too big, show message
    console.error('Not possible to find a QR_CODE_INFO_TO_USE: ', QR_CODE_INFO_TO_USE);
    return;
  }

  console.debug('QR_CODE_INFO_TO_USE: ', QR_CODE_INFO_TO_USE);

  //#region  version, version pattern modules calculation
  console.debug('%cversion, version pattern modules calculation', 'background: #f99');
  const VERSION_NUMBER_IN_BINARY = numberToBinary(QR_CODE_INFO_TO_USE.version, 6);
  console.debug(`VERSION_NUMBER_IN_BINARY (${QR_CODE_INFO_TO_USE.version}): ${VERSION_NUMBER_IN_BINARY}`);
  const ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN = calculateCorrectionBitsForVersion(VERSION_NUMBER_IN_BINARY);
  console.debug(
    `ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN: ${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN} (length: ${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN.length})`
  );
  const VERSION_PATTERN_ALL_BITS = `${VERSION_NUMBER_IN_BINARY}${ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN}`;
  console.debug(`VERSION_PATTERN_ALL_BITS: ${VERSION_PATTERN_ALL_BITS} (length: ${VERSION_PATTERN_ALL_BITS.length})`);
  //#endregion

  //#region format information
  console.debug('%cformat information', 'background: #f99');
  const ERROR_CORRECTION_LEVELS_CODIFICATION = { L: '01', M: '00', Q: '11', H: '10' };
  const SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY = ERROR_CORRECTION_LEVELS_CODIFICATION[errorCorrectionLevel];
  console.debug(
    `SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY (${errorCorrectionLevel}): ${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}`
  );
  const FORMATS_IN_BINARY = Object.keys(DATA_MASKS_PATTERNS).map(
    (key) => `${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${key}`
  );
  console.debug(`FORMATS_IN_BINARY:`, FORMATS_IN_BINARY);
  const FORTMAT_PATTERN_MASK = '101010000010010';
  console.debug('FORTMAT_PATTERN_MASK', FORTMAT_PATTERN_MASK);
  const FORMATS_PATTERN_AFTER_XOR_ALL_BITS = FORMATS_IN_BINARY.map((format) => ({
    [format.substring(2, 5)]: applyXOR(`${format}${calculateCorrectionBitsForFormat(format)}`, FORTMAT_PATTERN_MASK),
  })).reduce((prev, curr) => ({ ...prev, ...curr }), {});
  console.debug(`FORMATS_PATTERN_AFTER_XOR_ALL_BITS:`, FORMATS_PATTERN_AFTER_XOR_ALL_BITS);
  //#endregion

  //#region mode and message length
  console.debug('%cmode and message length', 'background: #f99');
  const MODE_BITS = '0100'; // in my case always Byte
  const MESSAGE_LENGTH_IN_BINARY = getMessageLengthAsBinary(QR_CODE_INFO_TO_USE.version, message.length);
  console.debug(`MESSAGE_LENGTH_IN_BINARY (${message.length}): ${MESSAGE_LENGTH_IN_BINARY}`);
  //#endregion

  //#region message in binary
  console.debug('%cmessage in binary', 'background: #f99');
  const MESSAGE_IN_BINARY = asciiToBinary(message);
  console.debug(
    'MESSAGE_IN_BINARY:',
    MESSAGE_IN_BINARY,
    '\n',
    splitInBytes(MESSAGE_IN_BINARY)
      .map((b, i) => `(${message[i]})->${b}`)
      .join('   ')
  );
  //#endregion

  //#region padding codewords and teminator
  console.debug('%cpadding codewords and teminator', 'background: #f99');
  const PADDING_CODEWORDS = getPaddingCodewords(
    QR_CODE_INFO_TO_USE.errorCorrectionLevel[errorCorrectionLevel].maxMessageLength,
    message.length
  );
  console.debug(`PADDING_CODEWORDS: ${PADDING_CODEWORDS || "''"}`, '\n', splitInBytes(PADDING_CODEWORDS).join(' '));
  const TERMINATOR = '0000'; // for all versions and modes
  //#endregion

  //#region bit stream
  console.debug('%cbit stream', 'background: #f99');
  const DATA_BIT_STREAM = `${MODE_BITS}${MESSAGE_LENGTH_IN_BINARY}${MESSAGE_IN_BINARY}${TERMINATOR}${PADDING_CODEWORDS}`; // TODO check if terminator is last or not
  console.debug(
    `DATA_BIT_STREAM (${DATA_BIT_STREAM.length / 8} codewords): ${DATA_BIT_STREAM}`,
    '\n',
    splitInBytes(DATA_BIT_STREAM).join(' ')
  );
  //#endregion

  //#region divide bit stream in blocks
  console.debug('%cdivide bit stream in blocks', 'background: #f99');
  const DATA_BLOCKS = [];
  const blocksStructure = QR_CODE_INFO_TO_USE.errorCorrectionLevel[errorCorrectionLevel].blocksStructure;
  console.debug('blocks structure', blocksStructure);
  let dataBitStreamCopy = DATA_BIT_STREAM;
  blocksStructure.forEach((block) => {
    for (let i = 0; i < block.numberOfBlocks; i++) {
      DATA_BLOCKS.push(dataBitStreamCopy.slice(0, block.dataCodewordsPerBlock * 8));
      dataBitStreamCopy = dataBitStreamCopy.slice(block.dataCodewordsPerBlock * 8);
    }
  });
  console.debug(`DATA_BLOCKS: ${DATA_BLOCKS.length} \n`, DATA_BLOCKS.map((b) => `${b.length / 8} codewords: ${b}`).join('\n'));
  //#endregion

  //#region calculate error correction bits for blocks
  console.debug('%ccalculate error correction bits for blocks', 'background: #f99');
  const alphaExponents = GENERATOR_POLYNOMIALS.find(
    (gp) =>
      gp.numberOfErrorCorrectionCodewords ===
      QR_CODE_INFO_TO_USE.errorCorrectionLevel[errorCorrectionLevel].numberOfErrorCorrectionCodewords / DATA_BLOCKS.length
  ).alphaExponents;

  const polynomial = alphaExponents
    .map((ae) => EXPONENTIALS_TABLE[ae])
    .map((v) => numberToBinary(v))
    .join('');
  const ERROR_CORRECTION_BITS_BLOCKS = DATA_BLOCKS.map((block) => divideBinaryPolinomials(block, polynomial));
  console.debug(
    `ERROR_CORRECTION_BITS_BLOCKS: ${ERROR_CORRECTION_BITS_BLOCKS.length} \n`,
    ERROR_CORRECTION_BITS_BLOCKS.map((b) => `${b.length / 8} codewords: ${b}`).join('\n')
  );
  //#endregion

  //#region paint qr code without masking
  console.debug('%cpaint qr code without masking', 'background: #f99');
  const qrCodeMatrixWithoutMasking = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);

  // use another color to avoid applying masking to them
  paintModulesForAllPositionPatterns(qrCodeMatrixWithoutMasking, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
  paintModulesForAllAlignmentPatterns(qrCodeMatrixWithoutMasking, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
  paintModulesForAllTimingPatterns(qrCodeMatrixWithoutMasking, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
  paintModulesForAllVersionPatterns(qrCodeMatrixWithoutMasking, VERSION_PATTERN_ALL_BITS, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
  paintModulesForAllFormatPatterns(qrCodeMatrixWithoutMasking, '111111111111111', EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR); // this is fake (not fully calculated yet)
  paintModules(qrCodeMatrixWithoutMasking, [[QR_CODE_INFO_TO_USE.size - 8, 8]], EXCLUDE_FROM_MASK_COLOR); // override always dark module

  // mix data block codewords (including mode, message length, padding codewords and terminator)
  let mixedDataBlocks = '';
  const dataBlocksInCodewords = DATA_BLOCKS.map((block) => splitInBytes(block));
  for (let i = 0; i < Math.max(...dataBlocksInCodewords.map((b) => b.length)); i++) {
    for (let j = 0; j < dataBlocksInCodewords.length; j++) {
      if (dataBlocksInCodewords[j][i] !== undefined) mixedDataBlocks += dataBlocksInCodewords[j][i];
    }
  }
  console.debug('mixedDataBlocks', mixedDataBlocks);
  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, mixedDataBlocks);

  // mix error correction block codewords
  let mixedErrorCorrectionBlocks = '';
  const errorCorrectionBitsBlocksInCodewords = ERROR_CORRECTION_BITS_BLOCKS.map((block) => splitInBytes(block));
  for (let i = 0; i < Math.max(...errorCorrectionBitsBlocksInCodewords.map((b) => b.length)); i++) {
    for (let j = 0; j < errorCorrectionBitsBlocksInCodewords.length; j++) {
      if (errorCorrectionBitsBlocksInCodewords[j][i] !== undefined)
        mixedErrorCorrectionBlocks += errorCorrectionBitsBlocksInCodewords[j][i];
    }
  }
  console.debug('mixedErrorCorrectionBlocks', mixedErrorCorrectionBlocks);
  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, mixedErrorCorrectionBlocks);

  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, '0'.repeat(QR_CODE_INFO_TO_USE.reminderBits));
  //#endregion

  //#region apply and evaluate masking
  console.debug('%capply and evaluate masking', 'background: #f99');
  const QR_CODES_WITH_MASK_APPLIED = Object.keys(DATA_MASKS_PATTERNS).reduce(
    (prev, maskId) => ({ ...prev, [maskId]: applyMask(maskId, qrCodeMatrixWithoutMasking) }),
    {}
  );

  const maskScores = Object.entries(QR_CODES_WITH_MASK_APPLIED).reduce(
    (prev, entry) => ({ ...prev, [entry[0]]: evaluateQrCodeAfterMaskApplied(entry[1]) }),
    {}
  );
  console.debug('maskScores', maskScores);

  // choose the one with less score
  const MASK_APPLIED = Object.keys(maskScores).reduce((a, b) => (maskScores[a] < maskScores[b] ? a : b));
  console.debug(`MASK_APPLIED: ${MASK_APPLIED}`);
  //#endregion

  //#region paint final qr code
  paintModulesForAllPositionPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED]);
  paintModulesForAllAlignmentPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED]);
  paintModulesForAllTimingPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED]);
  paintModulesForAllVersionPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], VERSION_PATTERN_ALL_BITS);
  paintModulesForAllFormatPatterns(QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], FORMATS_PATTERN_AFTER_XOR_ALL_BITS[MASK_APPLIED]);
  paintSvgQrCode(CSS_IDS.GENERATED_FINAL_QR_CODE, QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], { withGrid: false, margin: 0 });
  //#endregion
}

generateQrCode2(message, errorCapacity);

/*
 // TODO remove, this is for testing
  const howToEnterDataExplanationMatrix = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);
  paintModulesForAllPositionPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllAlignmentPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllTimingPatterns(howToEnterDataExplanationMatrix);
  paintModulesForAllVersionPatterns(
    howToEnterDataExplanationMatrix,
    VERSION_PATTERN_ALL_BITS,
    defaultDarkColor,
    '#666'
  );
  paintModulesForAllFormatPatterns(howToEnterDataExplanationMatrix, '101001110100101'); // TODO this is fake
  // mode (data codification format, always binary in my case)
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    MODE_BITS,
    dataCodificationFormatDarkColor,
    dataCodificationFormatLightColor
  );
  // message length
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    MESSAGE_LENGTH_IN_BINARY,
    numberOfCharactersEnteredDarkColor,
    numberOfCharactersEnteredLightColor
  );
  // paint the data
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, MESSAGE_IN_BINARY, dataEnteredDarkColor, dataEnteredLightColor);
  // padding bits (in my case always 4 modules)
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, PADDING_CODEWORDS);
  // padding codewords
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    TERMINATOR,
    padCodewordDarkColor,
    padCodewordLightColor
  );
  // error correction modules
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    ERROR_CORRECTION_BITS_BLOCKS[0],
    errorCodewordsDarkColor,
    errorCodewordsLightColor
  );
  // reminder bits for qr code symbol (max 7 modules)
  paintModulesForDataAndErrorRegion(howToEnterDataExplanationMatrix, '0000000', undefined, 'navajowhite');
  paintSvgQrCode(CSS_IDS.HOW_TO_ENTER_DATA_EXPLANATION, howToEnterDataExplanationMatrix);
 */
