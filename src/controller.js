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
  convertAsciiToBinary,
  createQrCodeMatrix,
  getMessageLengthAsBinary,
  getPaddingCodewords,
  paintSvgQrCode,
} from './qr-code-utils';
import { QR_CODE_VERSIONS } from './qr-code-versions';
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
  generateQrCode(message, errorCapacity);
});

function generateQrCode(message, errorCapacity) {
  const qrCodeVersion = QR_CODE_VERSIONS.find((qrVersion) => qrVersion.errorCapacity[errorCapacity] >= message.length);

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
  paintModulesForAllPositionPatterns(howToEnterDataExplanationMatrix, defaultDarkColor, '#666');
  paintModulesForAllAlignmentPatterns(howToEnterDataExplanationMatrix, defaultDarkColor, '#666');
  paintModulesForAllTimingPatterns(howToEnterDataExplanationMatrix, defaultDarkColor, '#666');
  paintModulesForAllVersionPatterns(
    howToEnterDataExplanationMatrix,
    `${versionInBinary}${errorCorrectionBitsVersionPattern}`,
    defaultDarkColor,
    '#666'
  );
  paintModulesForAllFormatPatterns(howToEnterDataExplanationMatrix, formatBitsAfterXor, defaultDarkColor, '#666');
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
  paintModulesForDataAndErrorRegion(
    howToEnterDataExplanationMatrix,
    convertAsciiToBinary(message),
    dataEnteredDarkColor,
    dataEnteredLightColor
  );
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
generateQrCode(message, errorCapacity);

//#endregion listener-create-qr-code
