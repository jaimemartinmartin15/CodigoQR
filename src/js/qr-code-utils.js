export function applyXOR(bits1, bits2) {
  let xor = '';
  for (let i = 0; i < bits1.length; i++) {
    xor += bits1[i] === bits2[i] ? '0' : '1';
  }
  return xor;
}

export function asciiToBinary(message) {
  let messageInBinary = '';
  for (let i = 0; i < message.length; i++) {
    messageInBinary += `${(+message.charCodeAt(i) >>> 0).toString(2).padStart(8, '0')}`;
  }
  return messageInBinary;
}

export function getMessageLengthInBinary(qrCodeVersionNumber, messageLength) {
  // version 1 to 9 -> 8 modules, version 10 to 40 -> 16 modules
  const modulesLength = qrCodeVersionNumber <= 9 ? 8 : 16;
  return numberToBinary(messageLength, modulesLength);
}

export function numberToBinary(n, maxLength = 8) {
  // number to binary
  return (n >>> 0).toString(2).padStart(maxLength, '0');
}

export function getPaddingCodewords(maxMessageLength, messageLength) {
  const padCodeword1 = '11101100';
  const padCodeword2 = '00010001';

  return `${padCodeword1}${padCodeword2}`.repeat(maxMessageLength - messageLength).substring(0, (maxMessageLength - messageLength) * 8);
}
