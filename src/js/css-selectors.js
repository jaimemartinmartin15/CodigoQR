export const CSS_INPUTS = {
  MESSAGE: 'textarea[name="message"]',
  ERROR_CORRECTION_LEVEL: 'input[name="error-correction-level"]',
};

export const CSS_CLASSES = {
  NUMBER_OF_CHARACTERS_IN_THE_INPUT: '.number-of-characters-in-the-input',
  SELECTED_ERROR_CORRECTION_LEVEL: '.selected-error-correction-level',

  QR_CODE_VERSION: '.qr-code-version',
  QR_CODE_VERSION_BINARY: '.qr-code-version-binary',
  VERSION_CORRECTION_BITS: '.version-correction-bits',

  ERROR_CORRECTION_LEVEL_BINARY: '.error-correction-level-binary',
  MASK_CODIFICATION_BITS: '.mask-codification-bits',
  FORMAT_BITS: '.format-bits',
  FORMAT_CORRECTION_BITS: '.format-correction-bits',
};

export const CSS_IDS = {
  GENERATE_QR_CODE_BUTTON: '#generate-qr-code-button',

  SVG_FINAL_QR_CODE: '#svg-final-qr-code',
  SVG_EMPTY_QR_CODE: '#svg-empty-qr-code',
  SVG_SECTIONS_QR_CODE: '#svg-sections-qr-code',
  SVG_DATA_REGION_EXPLAINED_QR_CODE: '#svg-data-region-explained-qr-code',
  SVG_MASK_QR_CODE: (maskId) => `#mask-${maskId}`,

  VERSIONS_TABLE: '#versions-table',
  ERROR_CORRECTION_LEVEL_CODIFICATION_TABLE: '#error-correction-level-codification-table',
  MASK_CODIFICATION_TABLE: '#mask-codification-table',

  ALIGNMENT_PATTERNS_DESCRIPTION: '#alignment-patterns-description',

  CALCULATION_OF_VERSION_CORRECTION_BITS: '#calculation-of-version-correction-bits',
  CALCULATION_OF_FORMAT_CORRECTION_BITS: '#calculation-of-format-correction-bits',

  VERSION_PATTERN_COMPLETION_1: '#version-pattern-completion-1',
  VERSION_PATTERN_COMPLETION_2: '#version-pattern-completion-2',
  FORMAT_PATTERN_COMPLETION_1: '#format-pattern-completion-1',
  FORMAT_PATTERN_COMPLETION_2: '#format-pattern-completion-2',
  FORMAT_PATTERN_COMPLETION_3: '#format-pattern-completion-3',

  FORMAT_15_BITS: '#format-15-bits',
  FORMAT_15_BITS_AFTER_XOR: '#format-15-bits-after-xor',

  ASCII_MESSAGE_TABLE: '#ascii-message-table',
  HOW_TO_SPLIT_IN_BLOCKS: '#how-to-split-in-blocks',
};
