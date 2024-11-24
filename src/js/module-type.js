/*
 * Each module will have this structure
 * {
 *   type: MODULE_TYPE,
 *   bit: '0' | '1',
 *   letter: 'text',
 *   lightColor: typeModuleLightColor,
 *   darkColor: typeModuleDarkColor,
 * }
 */

export const MODULE_TYPE = {
  NOT_DEFINED: 'NOT_DEFINED',
  POSITION: 'POSITION',
  SEPARATOR: 'SEPARATOR',
  ALIGNMENT: 'ALIGNMENT',
  TIMING: 'TIMING',
  VERSION: 'VERSION',
  FORMAT: 'FORMAT',
  MODE: 'MODE',
  SEGMENT_LENGTH: 'SEGMENT_LENGTH',
  MESSAGE: 'MESSAGE',
  TERMINATOR: 'TERMINATOR',
  PADDING_CODEWORD: 'PADDING_CODEWORD',
  ERROR_CORRECTION: 'ERROR_CORRECTION',
  REMINDER: 'REMINDER',
  MASK: 'MASK',
};
