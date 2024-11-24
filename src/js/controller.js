import { CSS_INPUTS } from './css-selectors';
import { ELEMENTS } from './elements';
import { generateQrCode } from './qr-code-generation';
import { createVersionsTable } from './table-handlers';

function readInputs() {
  // read inputs to create the qr code for the MESSAGE and ERROR CAPACITY selected
  const textarea = document.querySelector(CSS_INPUTS.MESSAGE);
  const message = textarea.value || textarea.placeholder;
  const errorCorrectionLevel = Array.from(document.querySelectorAll(CSS_INPUTS.ERROR_CORRECTION_LEVEL)).find((r) => r.checked).value;
  return { message, errorCorrectionLevel };
}

ELEMENTS.GENERATE_QR_CODE_BUTTON.addEventListener('click', () => {
  const { message, errorCorrectionLevel } = readInputs();
  generateQrCode(message, errorCorrectionLevel);
});

createVersionsTable();

// autogenerate qr code with default placeholder
ELEMENTS.GENERATE_QR_CODE_BUTTON.click();
