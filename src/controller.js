import {
  calculateCorrectionBitsForFormat,
  calculateCorrectionBitsForVersion,
  showFormatPatternCompletion,
  showHowFormatCorrectionBitsAreCalculated,
  showHowVersionCorrectionBitsAreCalculated,
  showVersionPatternCompletion,
} from './calculation-of-correction-bits';
import {
  alignmentPatternDarkColor,
  alignmentPatternLightColor,
  dataEnteredDarkColor,
  dataEnteredLightColor,
  defaultLightColor,
  errorCodewordsDarkColor,
  errorCodewordsLightColor,
  formatInformationDarkColor,
  formatInformationLightColor,
  modeDarkColor,
  modeLightColor,
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
  createMessageToAsciiTable,
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
  generateQrCode(message, errorCapacity);
});

// create the default qr code with the input placeholder
const { message, errorCapacity } = readInputs();
generateQrCode(message, errorCapacity);

//#endregion listener-create-qr-code

function generateQrCode(message, errorCorrectionLevel) {
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
  console.debug('FORTMAT_PATTERN_MASK:', FORTMAT_PATTERN_MASK);
  const ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN = FORMATS_IN_BINARY.map((format) => ({
    [format]: calculateCorrectionBitsForFormat(format),
  })).reduce((prev, curr) => ({ ...prev, ...curr }), {});
  console.debug(`ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN:`, ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN);
  const FORMATS_PATTERN_AFTER_XOR_ALL_BITS = FORMATS_IN_BINARY.map((format) => ({
    [format]: applyXOR(`${format}${ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN[format]}`, FORTMAT_PATTERN_MASK),
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
  let MIXED_DATA_BLOCKS = '';
  const dataBlocksInCodewords = DATA_BLOCKS.map((block) => splitInBytes(block));
  for (let i = 0; i < Math.max(...dataBlocksInCodewords.map((b) => b.length)); i++) {
    for (let j = 0; j < dataBlocksInCodewords.length; j++) {
      if (dataBlocksInCodewords[j][i] !== undefined) MIXED_DATA_BLOCKS += dataBlocksInCodewords[j][i];
    }
  }
  console.debug('MIXED_DATA_BLOCKS', MIXED_DATA_BLOCKS);
  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, MIXED_DATA_BLOCKS);

  // mix error correction block codewords
  let MIXED_ERROR_CORRECTION_BLOCKS = '';
  const errorCorrectionBitsBlocksInCodewords = ERROR_CORRECTION_BITS_BLOCKS.map((block) => splitInBytes(block));
  for (let i = 0; i < Math.max(...errorCorrectionBitsBlocksInCodewords.map((b) => b.length)); i++) {
    for (let j = 0; j < errorCorrectionBitsBlocksInCodewords.length; j++) {
      if (errorCorrectionBitsBlocksInCodewords[j][i] !== undefined)
        MIXED_ERROR_CORRECTION_BLOCKS += errorCorrectionBitsBlocksInCodewords[j][i];
    }
  }
  console.debug('MIXED_ERROR_CORRECTION_BLOCKS', MIXED_ERROR_CORRECTION_BLOCKS);
  paintModulesForDataAndErrorRegion(qrCodeMatrixWithoutMasking, MIXED_ERROR_CORRECTION_BLOCKS);

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
  paintModulesForAllFormatPatterns(
    QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED],
    FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`]
  );
  paintSvgQrCode(CSS_IDS.GENERATED_FINAL_QR_CODE, QR_CODES_WITH_MASK_APPLIED[MASK_APPLIED], { withGrid: false, margin: 4 });
  //#endregion

  //#region paint empty qr code
  const emptyQrCodeMatrix = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);
  paintSvgQrCode(CSS_IDS.EMPTY_QR_CODE, emptyQrCodeMatrix);
  //#endregion

  //#region decide size of qr code step explanation
  // number of characters to codify in the qr code
  document.querySelectorAll(CSS_CLASSES.NUMBER_OF_CHARACTERS_IN_THE_INPUT).forEach((e) => (e.textContent = message.length));
  // selected error capacity
  document.querySelectorAll(CSS_CLASSES.SELECTED_ERROR_CAPACITY_LEVEL).forEach((e) => (e.textContent = errorCorrectionLevel));
  // highlight the row in the table
  hightlightVersionInVersionsTable(QR_CODE_INFO_TO_USE.version, errorCorrectionLevel);
  //#endregion

  //#region qr code sections
  // paint matrix and svg qr code sections
  const sectionsQrCodeMatrix = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);
  paintModulesForAllPositionPatterns(sectionsQrCodeMatrix, positionPatternDarkColor, positionPatternLightColor);
  paintModulesForAllAlignmentPatterns(sectionsQrCodeMatrix, alignmentPatternDarkColor, alignmentPatternLightColor);
  paintModulesForAllTimingPatterns(sectionsQrCodeMatrix, timingPatternDarkColor, timingPatternLightColor);
  paintModulesForAllVersionPatterns(
    sectionsQrCodeMatrix,
    VERSION_PATTERN_ALL_BITS,
    versionInformationDarkColor,
    versionInformationLightColor
  );
  paintModulesForAllFormatPatterns(
    sectionsQrCodeMatrix,
    FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`],
    formatInformationDarkColor,
    formatInformationLightColor
  );
  paintSvgQrCode(CSS_IDS.QR_CODE_SECTIONS, sectionsQrCodeMatrix, { withGrid: true, margin: 3 });

  // alignment patterns
  hightlightVersionInAlignmentPatternsTable(QR_CODE_INFO_TO_USE.version);

  // version pattern
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION)).forEach((e) => (e.textContent = QR_CODE_INFO_TO_USE.version));
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = VERSION_NUMBER_IN_BINARY));
  showHowVersionCorrectionBitsAreCalculated(VERSION_NUMBER_IN_BINARY);
  Array.from(document.querySelectorAll(CSS_CLASSES.QR_CODE_VERSION_BINARY)).forEach((e) => (e.textContent = VERSION_NUMBER_IN_BINARY));
  Array.from(document.querySelectorAll(CSS_CLASSES.VERSION_CORRECTION_BITS)).forEach(
    (e) => (e.textContent = ERROR_CORRECTION_BITS_FOR_VERSION_PATTERN)
  );
  showVersionPatternCompletion(VERSION_PATTERN_ALL_BITS);

  // format pattern
  Array.from(document.querySelectorAll(CSS_CLASSES.ERROR_CAPACITY_CODIFICATION_BITS)).forEach(
    (e) => (e.innerHTML = SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY)
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.MASK_CODIFICATION_BITS)).forEach((e) => (e.innerHTML = MASK_APPLIED));
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_INFORMATION_DATA_BITS)).forEach(
    (e) => (e.innerHTML = `${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`)
  );
  Array.from(document.querySelectorAll(CSS_CLASSES.FORMAT_INFORMATION_CORRECTION_BITS)).forEach(
    (e) =>
      (e.innerHTML = ERROR_CORRECTION_BITS_FOR_FORMAT_PATTERN[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`])
  );
  showHowFormatCorrectionBitsAreCalculated(`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`);
  document.querySelector(CSS_IDS.INFORMATION_FORMAT_15_BITS_AFTER_XOR).textContent =
    FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`];
  showFormatPatternCompletion(
    FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`]
  );
  //#endregion

  //#region data modules and blocks
  createMessageToAsciiTable(message);

  // show how to divide data in blocks
  ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.innerHTML = '';
  DATA_BLOCKS.forEach((block, blockI) => {
    const svgBlock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBlock.setAttribute('viewBox', `0 0 ${block.length} 1`);
    svgBlock.classList.add('data-block');

    for (let bitI = 0; bitI < block.length; bitI++) {
      const messageBitIndex =
        DATA_BLOCKS.slice(0, blockI).reduce((prev, curr) => prev + curr.length, 0) + bitI - 4 - MESSAGE_LENGTH_IN_BINARY.length;

      const module = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      module.setAttribute('x', bitI);
      module.setAttribute('y', 0);
      module.setAttribute('width', 1);
      module.setAttribute('height', 1);
      if (blockI === 0 && bitI <= 3) {
        module.setAttribute('fill', block[bitI] === '0' ? modeLightColor : modeDarkColor);
      } else if (blockI === 0 && bitI <= 3 + MESSAGE_LENGTH_IN_BINARY.length) {
        module.setAttribute('fill', block[bitI] === '0' ? numberOfCharactersEnteredLightColor : numberOfCharactersEnteredDarkColor);
      } else if (messageBitIndex / 8 < message.length) {
        module.setAttribute('fill', block[bitI] === '0' ? dataEnteredLightColor : dataEnteredDarkColor);
      } else if (messageBitIndex < message.length * 8 + 4) {
        module.setAttribute('fill', defaultLightColor);
      } else {
        module.setAttribute('fill', block[bitI] === '0' ? padCodewordLightColor : padCodewordDarkColor);
      }
      svgBlock.append(module);

      if (messageBitIndex >= 0 && messageBitIndex / 8 < message.length) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', bitI + 0.5);
        text.setAttribute('y', 0.75);
        text.textContent = `${message[Math.floor(messageBitIndex / 8)]}${7 - (messageBitIndex % 8)}`;
        text.setAttribute('fill', block[bitI] === '0' ? dataEnteredDarkColor : dataEnteredLightColor);
        svgBlock.append(text);
      }
    }

    ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.append(svgBlock);
  });
  //#endregion

  //#region paint data, error and reminder qr code explanation
  const qrCodeWithOnlyData = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);
  paintModulesForAllPositionPatterns(qrCodeWithOnlyData);
  paintModulesForAllAlignmentPatterns(qrCodeWithOnlyData);
  paintModulesForAllTimingPatterns(qrCodeWithOnlyData);
  paintModulesForAllVersionPatterns(qrCodeWithOnlyData, VERSION_PATTERN_ALL_BITS);
  paintModulesForAllFormatPatterns(
    qrCodeWithOnlyData,
    FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`]
  );

  //  TODO fix this because it paints all as data, and it also contains pad codewords
  paintModulesForDataAndErrorRegion(qrCodeWithOnlyData, MIXED_DATA_BLOCKS.slice(0, 4), modeDarkColor, modeLightColor);
  paintModulesForDataAndErrorRegion(
    qrCodeWithOnlyData,
    MIXED_DATA_BLOCKS.slice(4, 4 + MESSAGE_LENGTH_IN_BINARY.length),
    numberOfCharactersEnteredDarkColor,
    numberOfCharactersEnteredLightColor
  );
  paintModulesForDataAndErrorRegion(
    qrCodeWithOnlyData,
    MIXED_DATA_BLOCKS.slice(4 + MESSAGE_LENGTH_IN_BINARY.length),
    dataEnteredDarkColor,
    dataEnteredLightColor
  );

  // errors and reminder bits
  paintModulesForDataAndErrorRegion(qrCodeWithOnlyData, MIXED_ERROR_CORRECTION_BLOCKS, errorCodewordsDarkColor, errorCodewordsLightColor);
  paintModulesForDataAndErrorRegion(qrCodeWithOnlyData, '0'.repeat(QR_CODE_INFO_TO_USE.reminderBits));

  paintSvgQrCode(CSS_IDS.QR_CODE_DATA_REGION_EXPLAINED, qrCodeWithOnlyData);
  //#endregion

  //#region paint masks
  Object.keys(DATA_MASKS_PATTERNS).forEach((maskId) => {
    const qrCodeMatrix = createQrCodeMatrix(QR_CODE_INFO_TO_USE.size);

    paintModulesForAllPositionPatterns(qrCodeMatrix, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
    paintModulesForAllAlignmentPatterns(qrCodeMatrix, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
    paintModulesForAllTimingPatterns(qrCodeMatrix, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
    paintModulesForAllVersionPatterns(qrCodeMatrix, VERSION_PATTERN_ALL_BITS, EXCLUDE_FROM_MASK_COLOR, EXCLUDE_FROM_MASK_COLOR);
    paintModulesForAllFormatPatterns(
      qrCodeMatrix,
      FORMATS_PATTERN_AFTER_XOR_ALL_BITS[`${SELECTED_ERROR_CORRECTION_LEVEL_CODIFICATION_IN_BINARY}${MASK_APPLIED}`],
      EXCLUDE_FROM_MASK_COLOR,
      EXCLUDE_FROM_MASK_COLOR
    );

    applyMask(maskId, qrCodeMatrix);

    paintSvgQrCode(`#mask-${maskId}`, applyMask(maskId, qrCodeMatrix), { withGrid: false, margin: 0 });
  });
  //#endregion

  window.scrollTo(0, document.body.scrollHeight);
}
