import { ELEMENTS } from './elements';
import { generateQrCode } from './qr-code-generation';
import { createAlignmentPatternsTable, createVersionsTable } from './table-handlers';

function readInputs() {
  // read inputs to create the qr code for the MESSAGE and ERROR CAPACITY selected
  const input = document.querySelector('textarea');
  const message = input.value || input.placeholder;
  const errorCapacity = Array.from(document.querySelectorAll('input[type="radio"][name="ECC"]')).find((r) => r.checked).value;
  return { message, errorCapacity };
}

ELEMENTS.GENERATE_QR_CODE_BUTTON.addEventListener('click', () => {
  const { message, errorCapacity } = readInputs();
  generateQrCode(message, errorCapacity);
});

createVersionsTable();
createAlignmentPatternsTable();

// create the default qr code with the input placeholder
const { message, errorCapacity } = readInputs();
generateQrCode(message, errorCapacity);
