// Note: the errorCorrectionLevel.maxMessageLength is for binary data
// Note: commented fields are not used and should not be included in PROD. Uncomment them when used

export const QR_CODE_STANDARS = [
  {
    version: 1,
    size: 21,
    // functionPatternModules: 202,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 208,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 17,
        numberOfErrorCorrectionCodewords: 7,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 19 }],
      },
      M: {
        maxMessageLength: 14,
        numberOfErrorCorrectionCodewords: 10,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 16 }],
      },
      Q: {
        maxMessageLength: 11,
        numberOfErrorCorrectionCodewords: 13,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 13 }],
      },
      H: {
        maxMessageLength: 7,
        numberOfErrorCorrectionCodewords: 17,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 9 }],
      },
    },
    alignmentPatternPositions: [],
  },
  {
    version: 2,
    size: 25,
    // functionPatternModules: 235,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 359,
    reminderBits: 7,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 32,
        numberOfErrorCorrectionCodewords: 10,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 34 }],
      },
      M: {
        maxMessageLength: 26,
        numberOfErrorCorrectionCodewords: 16,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 28 }],
      },
      Q: {
        maxMessageLength: 20,
        numberOfErrorCorrectionCodewords: 22,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 22 }],
      },
      H: {
        maxMessageLength: 14,
        numberOfErrorCorrectionCodewords: 28,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 16 }],
      },
    },
    alignmentPatternPositions: [16],
  },
  {
    version: 3,
    size: 29,
    // functionPatternModules: 243,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 567,
    reminderBits: 7,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 53,
        numberOfErrorCorrectionCodewords: 15,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 55 }],
      },
      M: {
        maxMessageLength: 42,
        numberOfErrorCorrectionCodewords: 26,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 44 }],
      },
      Q: {
        maxMessageLength: 32,
        numberOfErrorCorrectionCodewords: 36,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 17 }],
      },
      H: {
        maxMessageLength: 24,
        numberOfErrorCorrectionCodewords: 44,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 13 }],
      },
    },
    alignmentPatternPositions: [20],
  },
  {
    version: 4,
    size: 33,
    // functionPatternModules: 251,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 807,
    reminderBits: 7,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 78,
        numberOfErrorCorrectionCodewords: 20,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 80 }],
      },
      M: {
        maxMessageLength: 62,
        numberOfErrorCorrectionCodewords: 36,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 32 }],
      },
      Q: {
        maxMessageLength: 46,
        numberOfErrorCorrectionCodewords: 52,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 24 }],
      },
      H: {
        maxMessageLength: 34,
        numberOfErrorCorrectionCodewords: 64,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 9 }],
      },
    },
    alignmentPatternPositions: [24],
  },
  {
    version: 5,
    size: 37,
    // functionPatternModules: 259,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 1079,
    reminderBits: 7,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 106,
        numberOfErrorCorrectionCodewords: 26,
        blocksStructure: [{ numberOfBlocks: 1, dataCodewordsPerBlock: 108 }],
      },
      M: {
        maxMessageLength: 84,
        numberOfErrorCorrectionCodewords: 48,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 43 }],
      },
      Q: {
        maxMessageLength: 60,
        numberOfErrorCorrectionCodewords: 72,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 16 },
        ],
      },
      H: {
        maxMessageLength: 44,
        numberOfErrorCorrectionCodewords: 88,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 11 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 12 },
        ],
      },
    },
    alignmentPatternPositions: [28],
  },
  {
    version: 6,
    size: 41,
    // functionPatternModules: 267,
    // formatInformationModules: 31,
    // versionInformationModules: 0,
    // dataModules: 1383,
    reminderBits: 7,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 134,
        numberOfErrorCorrectionCodewords: 36,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 68 }],
      },
      M: {
        maxMessageLength: 106,
        numberOfErrorCorrectionCodewords: 64,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 27 }],
      },
      Q: {
        maxMessageLength: 74,
        numberOfErrorCorrectionCodewords: 96,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 19 }],
      },
      H: {
        maxMessageLength: 58,
        numberOfErrorCorrectionCodewords: 112,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 15 }],
      },
    },
    alignmentPatternPositions: [32],
  },
  {
    version: 7,
    size: 45,
    // functionPatternModules: 390,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 1568,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 154,
        numberOfErrorCorrectionCodewords: 40,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 78 }],
      },
      M: {
        maxMessageLength: 122,
        numberOfErrorCorrectionCodewords: 72,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 31 }],
      },
      Q: {
        maxMessageLength: 86,
        numberOfErrorCorrectionCodewords: 108,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 14 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 15 },
        ],
      },
      H: {
        maxMessageLength: 64,
        numberOfErrorCorrectionCodewords: 130,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 13 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 14 },
        ],
      },
    },
    alignmentPatternPositions: [4, 20, 36],
  },
  {
    version: 8,
    size: 49,
    // functionPatternModules: 398,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 1936,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 192,
        numberOfErrorCorrectionCodewords: 48,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 97 }],
      },
      M: {
        maxMessageLength: 152,
        numberOfErrorCorrectionCodewords: 88,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 38 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 39 },
        ],
      },
      Q: {
        maxMessageLength: 108,
        numberOfErrorCorrectionCodewords: 132,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 18 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 19 },
        ],
      },
      H: {
        maxMessageLength: 84,
        numberOfErrorCorrectionCodewords: 156,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 14 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 15 },
        ],
      },
    },
    alignmentPatternPositions: [4, 22, 40],
  },
  {
    version: 9,
    size: 53,
    // functionPatternModules: 406,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 2336,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 230,
        numberOfErrorCorrectionCodewords: 60,
        blocksStructure: [{ numberOfBlocks: 2, dataCodewordsPerBlock: 116 }],
      },
      M: {
        maxMessageLength: 180,
        numberOfErrorCorrectionCodewords: 110,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 36 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 37 },
        ],
      },
      Q: {
        maxMessageLength: 130,
        numberOfErrorCorrectionCodewords: 160,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 17 },
        ],
      },
      H: {
        maxMessageLength: 98,
        numberOfErrorCorrectionCodewords: 192,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 12 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 13 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 44],
  },
  {
    version: 10,
    size: 57,
    // functionPatternModules: 414,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 2768,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 271,
        numberOfErrorCorrectionCodewords: 72,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 68 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 69 },
        ],
      },
      M: {
        maxMessageLength: 213,
        numberOfErrorCorrectionCodewords: 130,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 43 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 44 },
        ],
      },
      Q: {
        maxMessageLength: 151,
        numberOfErrorCorrectionCodewords: 192,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 19 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 20 },
        ],
      },
      H: {
        maxMessageLength: 119,
        numberOfErrorCorrectionCodewords: 224,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 26, 48],
  },
  {
    version: 11,
    size: 61,
    // functionPatternModules: 422,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 3232,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 321,
        numberOfErrorCorrectionCodewords: 80,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 81 }],
      },
      M: {
        maxMessageLength: 251,
        numberOfErrorCorrectionCodewords: 150,
        blocksStructure: [
          { numberOfBlocks: 1, dataCodewordsPerBlock: 50 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 51 },
        ],
      },
      Q: {
        maxMessageLength: 177,
        numberOfErrorCorrectionCodewords: 224,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 137,
        numberOfErrorCorrectionCodewords: 264,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 12 },
          { numberOfBlocks: 8, dataCodewordsPerBlock: 13 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 52],
  },
  {
    version: 12,
    size: 65,
    // functionPatternModules: 430,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 3728,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 367,
        numberOfErrorCorrectionCodewords: 96,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 92 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 93 },
        ],
      },
      M: {
        maxMessageLength: 287,
        numberOfErrorCorrectionCodewords: 176,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 36 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 37 },
        ],
      },
      Q: {
        maxMessageLength: 203,
        numberOfErrorCorrectionCodewords: 260,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 20 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 21 },
        ],
      },
      H: {
        maxMessageLength: 155,
        numberOfErrorCorrectionCodewords: 308,
        blocksStructure: [
          { numberOfBlocks: 7, dataCodewordsPerBlock: 14 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 15 },
        ],
      },
    },
    alignmentPatternPositions: [4, 30, 56],
  },
  {
    version: 13,
    size: 69,
    // functionPatternModules: 438,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 4256,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 425,
        numberOfErrorCorrectionCodewords: 104,
        blocksStructure: [{ numberOfBlocks: 4, dataCodewordsPerBlock: 107 }],
      },
      M: {
        maxMessageLength: 331,
        numberOfErrorCorrectionCodewords: 198,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 37 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 38 },
        ],
      },
      Q: {
        maxMessageLength: 241,
        numberOfErrorCorrectionCodewords: 288,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 20 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 21 },
        ],
      },
      H: {
        maxMessageLength: 177,
        numberOfErrorCorrectionCodewords: 352,
        blocksStructure: [
          { numberOfBlocks: 12, dataCodewordsPerBlock: 11 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 12 },
        ],
      },
    },
    alignmentPatternPositions: [4, 32, 60],
  },
  {
    version: 14,
    size: 73,
    // functionPatternModules: 611,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 4651,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 458,
        numberOfErrorCorrectionCodewords: 120,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 115 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 116 },
        ],
      },
      M: {
        maxMessageLength: 362,
        numberOfErrorCorrectionCodewords: 216,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 40 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 41 },
        ],
      },
      Q: {
        maxMessageLength: 258,
        numberOfErrorCorrectionCodewords: 320,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 17 },
        ],
      },
      H: {
        maxMessageLength: 194,
        numberOfErrorCorrectionCodewords: 284,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 12 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 13 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 44, 64],
  },
  {
    version: 15,
    size: 77,
    // functionPatternModules: 619,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 5243,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 520,
        numberOfErrorCorrectionCodewords: 132,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 87 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 88 },
        ],
      },
      M: {
        maxMessageLength: 412,
        numberOfErrorCorrectionCodewords: 240,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 41 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 42 },
        ],
      },
      Q: {
        maxMessageLength: 292,
        numberOfErrorCorrectionCodewords: 360,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 220,
        numberOfErrorCorrectionCodewords: 432,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 12 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 13 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 46, 68],
  },
  {
    version: 16,
    size: 81,
    // functionPatternModules: 627,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 5867,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 586,
        numberOfErrorCorrectionCodewords: 144,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 98 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 99 },
        ],
      },
      M: {
        maxMessageLength: 450,
        numberOfErrorCorrectionCodewords: 280,
        blocksStructure: [
          { numberOfBlocks: 7, dataCodewordsPerBlock: 45 },
          { numberOfBlocks: 3, dataCodewordsPerBlock: 46 },
        ],
      },
      Q: {
        maxMessageLength: 322,
        numberOfErrorCorrectionCodewords: 408,
        blocksStructure: [
          { numberOfBlocks: 15, dataCodewordsPerBlock: 19 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 20 },
        ],
      },
      H: {
        maxMessageLength: 250,
        numberOfErrorCorrectionCodewords: 480,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 13, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 48, 72],
  },
  {
    version: 17,
    size: 85,
    // functionPatternModules: 635,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 6523,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 644,
        numberOfErrorCorrectionCodewords: 168,
        blocksStructure: [
          { numberOfBlocks: 1, dataCodewordsPerBlock: 107 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 108 },
        ],
      },
      M: {
        maxMessageLength: 504,
        numberOfErrorCorrectionCodewords: 308,
        blocksStructure: [
          { numberOfBlocks: 10, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 364,
        numberOfErrorCorrectionCodewords: 448,
        blocksStructure: [
          { numberOfBlocks: 1, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 15, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 280,
        numberOfErrorCorrectionCodewords: 532,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 14 },
          { numberOfBlocks: 17, dataCodewordsPerBlock: 15 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 52, 76],
  },
  {
    version: 18,
    size: 89,
    // functionPatternModules: 643,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 7211,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 718,
        numberOfErrorCorrectionCodewords: 180,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 120 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 121 },
        ],
      },
      M: {
        maxMessageLength: 560,
        numberOfErrorCorrectionCodewords: 338,
        blocksStructure: [
          { numberOfBlocks: 9, dataCodewordsPerBlock: 43 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 44 },
        ],
      },
      Q: {
        maxMessageLength: 394,
        numberOfErrorCorrectionCodewords: 504,
        blocksStructure: [
          { numberOfBlocks: 17, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 310,
        numberOfErrorCorrectionCodewords: 588,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 14 },
          { numberOfBlocks: 19, dataCodewordsPerBlock: 15 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 54, 80],
  },
  {
    version: 19,
    size: 93,
    // functionPatternModules: 651,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 7931,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 792,
        numberOfErrorCorrectionCodewords: 196,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 113 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 114 },
        ],
      },
      M: {
        maxMessageLength: 624,
        numberOfErrorCorrectionCodewords: 364,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 44 },
          { numberOfBlocks: 11, dataCodewordsPerBlock: 45 },
        ],
      },
      Q: {
        maxMessageLength: 442,
        numberOfErrorCorrectionCodewords: 546,
        blocksStructure: [
          { numberOfBlocks: 17, dataCodewordsPerBlock: 21 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 22 },
        ],
      },
      H: {
        maxMessageLength: 338,
        numberOfErrorCorrectionCodewords: 650,
        blocksStructure: [
          { numberOfBlocks: 9, dataCodewordsPerBlock: 13 },
          { numberOfBlocks: 16, dataCodewordsPerBlock: 14 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 56, 84],
  },
  {
    version: 20,
    size: 97,
    // functionPatternModules: 659,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 8683,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 858,
        numberOfErrorCorrectionCodewords: 224,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 107 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 108 },
        ],
      },
      M: {
        maxMessageLength: 666,
        numberOfErrorCorrectionCodewords: 416,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 41 },
          { numberOfBlocks: 13, dataCodewordsPerBlock: 42 },
        ],
      },
      Q: {
        maxMessageLength: 482,
        numberOfErrorCorrectionCodewords: 600,
        blocksStructure: [
          { numberOfBlocks: 15, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 382,
        numberOfErrorCorrectionCodewords: 700,
        blocksStructure: [
          { numberOfBlocks: 15, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 32, 60, 88],
  },
  {
    version: 21,
    size: 101,
    // functionPatternModules: 882,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 9252,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 929,
        numberOfErrorCorrectionCodewords: 224,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 116 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 117 },
        ],
      },
      M: {
        maxMessageLength: 711,
        numberOfErrorCorrectionCodewords: 442,
        blocksStructure: [{ numberOfBlocks: 17, dataCodewordsPerBlock: 42 }],
      },
      Q: {
        maxMessageLength: 509,
        numberOfErrorCorrectionCodewords: 644,
        blocksStructure: [
          { numberOfBlocks: 17, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 403,
        numberOfErrorCorrectionCodewords: 750,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 17 },
        ],
      },
    },
    alignmentPatternPositions: [4, 26, 48, 70, 92],
  },
  {
    version: 22,
    size: 105,
    // functionPatternModules: 890,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 10068,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1003,
        numberOfErrorCorrectionCodewords: 252,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 111 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 112 },
        ],
      },
      M: {
        maxMessageLength: 779,
        numberOfErrorCorrectionCodewords: 476,
        blocksStructure: [{ numberOfBlocks: 17, dataCodewordsPerBlock: 46 }],
      },
      Q: {
        maxMessageLength: 565,
        numberOfErrorCorrectionCodewords: 690,
        blocksStructure: [
          { numberOfBlocks: 7, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 16, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 439,
        numberOfErrorCorrectionCodewords: 816,
        blocksStructure: [{ numberOfBlocks: 34, dataCodewordsPerBlock: 13 }],
      },
    },
    alignmentPatternPositions: [4, 24, 48, 72, 96],
  },
  {
    version: 23,
    size: 109,
    // functionPatternModules: 898,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 10916,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1091,
        numberOfErrorCorrectionCodewords: 270,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 121 },
          { numberOfBlocks: 5, dataCodewordsPerBlock: 122 },
        ],
      },
      M: {
        maxMessageLength: 857,
        numberOfErrorCorrectionCodewords: 504,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 611,
        numberOfErrorCorrectionCodewords: 750,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 461,
        numberOfErrorCorrectionCodewords: 900,
        blocksStructure: [
          { numberOfBlocks: 16, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 52, 76, 100],
  },
  {
    version: 24,
    size: 113,
    // functionPatternModules: 906,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 11796,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1171,
        numberOfErrorCorrectionCodewords: 300,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 117 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 118 },
        ],
      },
      M: {
        maxMessageLength: 911,
        numberOfErrorCorrectionCodewords: 560,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 45 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 46 },
        ],
      },
      Q: {
        maxMessageLength: 661,
        numberOfErrorCorrectionCodewords: 810,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 16, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 511,
        numberOfErrorCorrectionCodewords: 960,
        blocksStructure: [
          { numberOfBlocks: 30, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 17 },
        ],
      },
    },
    alignmentPatternPositions: [4, 26, 52, 78, 104],
  },
  {
    version: 25,
    size: 117,
    // functionPatternModules: 914,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 12708,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1273,
        numberOfErrorCorrectionCodewords: 312,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 106 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 107 },
        ],
      },
      M: {
        maxMessageLength: 997,
        numberOfErrorCorrectionCodewords: 588,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 13, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 715,
        numberOfErrorCorrectionCodewords: 870,
        blocksStructure: [
          { numberOfBlocks: 7, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 22, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 535,
        numberOfErrorCorrectionCodewords: 1050,
        blocksStructure: [
          { numberOfBlocks: 22, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 13, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 30, 56, 82, 108],
  },
  {
    version: 26,
    size: 121,
    // functionPatternModules: 922,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 13652,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1367,
        numberOfErrorCorrectionCodewords: 336,
        blocksStructure: [
          { numberOfBlocks: 10, dataCodewordsPerBlock: 114 },
          { numberOfBlocks: 2, dataCodewordsPerBlock: 115 },
        ],
      },
      M: {
        maxMessageLength: 1059,
        numberOfErrorCorrectionCodewords: 644,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 751,
        numberOfErrorCorrectionCodewords: 952,
        blocksStructure: [
          { numberOfBlocks: 28, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 593,
        numberOfErrorCorrectionCodewords: 1110,
        blocksStructure: [
          { numberOfBlocks: 33, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 17 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 56, 84, 112],
  },
  {
    version: 27,
    size: 125,
    // functionPatternModules: 930,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 14628,
    reminderBits: 4,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1465,
        numberOfErrorCorrectionCodewords: 360,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 122 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 123 },
        ],
      },
      M: {
        maxMessageLength: 1125,
        numberOfErrorCorrectionCodewords: 700,
        blocksStructure: [
          { numberOfBlocks: 22, dataCodewordsPerBlock: 45 },
          { numberOfBlocks: 3, dataCodewordsPerBlock: 46 },
        ],
      },
      Q: {
        maxMessageLength: 805,
        numberOfErrorCorrectionCodewords: 1020,
        blocksStructure: [
          { numberOfBlocks: 8, dataCodewordsPerBlock: 23 },
          { numberOfBlocks: 26, dataCodewordsPerBlock: 24 },
        ],
      },
      H: {
        maxMessageLength: 625,
        numberOfErrorCorrectionCodewords: 1200,
        blocksStructure: [
          { numberOfBlocks: 12, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 28, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 32, 60, 88, 116],
  },
  {
    version: 28,
    size: 129,
    // functionPatternModules: 1203,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 15371,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1528,
        numberOfErrorCorrectionCodewords: 390,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 117 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 118 },
        ],
      },
      M: {
        maxMessageLength: 1190,
        numberOfErrorCorrectionCodewords: 728,
        blocksStructure: [
          { numberOfBlocks: 3, dataCodewordsPerBlock: 45 },
          { numberOfBlocks: 23, dataCodewordsPerBlock: 46 },
        ],
      },
      Q: {
        maxMessageLength: 868,
        numberOfErrorCorrectionCodewords: 1050,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 31, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 658,
        numberOfErrorCorrectionCodewords: 1260,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 31, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 48, 72, 96, 120],
  },
  {
    version: 29,
    size: 133,
    // functionPatternModules: 1211,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 16411,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1628,
        numberOfErrorCorrectionCodewords: 420,
        blocksStructure: [
          { numberOfBlocks: 7, dataCodewordsPerBlock: 116 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 117 },
        ],
      },
      M: {
        maxMessageLength: 1264,
        numberOfErrorCorrectionCodewords: 784,
        blocksStructure: [
          { numberOfBlocks: 21, dataCodewordsPerBlock: 45 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 46 },
        ],
      },
      Q: {
        maxMessageLength: 908,
        numberOfErrorCorrectionCodewords: 1140,
        blocksStructure: [
          { numberOfBlocks: 1, dataCodewordsPerBlock: 23 },
          { numberOfBlocks: 37, dataCodewordsPerBlock: 24 },
        ],
      },
      H: {
        maxMessageLength: 698,
        numberOfErrorCorrectionCodewords: 1350,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 26, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 52, 76, 100, 124],
  },
  {
    version: 30,
    size: 137,
    // functionPatternModules: 1219,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 17483,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1732,
        numberOfErrorCorrectionCodewords: 450,
        blocksStructure: [
          { numberOfBlocks: 5, dataCodewordsPerBlock: 115 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 116 },
        ],
      },
      M: {
        maxMessageLength: 1370,
        numberOfErrorCorrectionCodewords: 812,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 982,
        numberOfErrorCorrectionCodewords: 1200,
        blocksStructure: [
          { numberOfBlocks: 15, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 25, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 742,
        numberOfErrorCorrectionCodewords: 1440,
        blocksStructure: [
          { numberOfBlocks: 23, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 25, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 50, 76, 102, 128],
  },
  {
    version: 31,
    size: 141,
    // functionPatternModules: 1227,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 18587,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1840,
        numberOfErrorCorrectionCodewords: 480,
        blocksStructure: [
          { numberOfBlocks: 13, dataCodewordsPerBlock: 115 },
          { numberOfBlocks: 3, dataCodewordsPerBlock: 116 },
        ],
      },
      M: {
        maxMessageLength: 1452,
        numberOfErrorCorrectionCodewords: 868,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 29, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1030,
        numberOfErrorCorrectionCodewords: 1290,
        blocksStructure: [
          { numberOfBlocks: 42, dataCodewordsPerBlock: 22 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 23 },
        ],
      },
      H: {
        maxMessageLength: 790,
        numberOfErrorCorrectionCodewords: 1530,
        blocksStructure: [
          { numberOfBlocks: 23, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 28, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 54, 80, 106, 132],
  },
  {
    version: 32,
    size: 145,
    // functionPatternModules: 1235,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 19723,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 1952,
        numberOfErrorCorrectionCodewords: 510,
        blocksStructure: [{ numberOfBlocks: 17, dataCodewordsPerBlock: 115 }],
      },
      M: {
        maxMessageLength: 1538,
        numberOfErrorCorrectionCodewords: 924,
        blocksStructure: [
          { numberOfBlocks: 10, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 23, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1112,
        numberOfErrorCorrectionCodewords: 1350,
        blocksStructure: [
          { numberOfBlocks: 10, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 35, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 842,
        numberOfErrorCorrectionCodewords: 1620,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 35, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 32, 58, 84, 110, 136],
  },
  {
    version: 33,
    size: 149,
    // functionPatternModules: 1243,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 20891,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2068,
        numberOfErrorCorrectionCodewords: 540,
        blocksStructure: [
          { numberOfBlocks: 17, dataCodewordsPerBlock: 115 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 116 },
        ],
      },
      M: {
        maxMessageLength: 1628,
        numberOfErrorCorrectionCodewords: 980,
        blocksStructure: [
          { numberOfBlocks: 14, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 21, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1168,
        numberOfErrorCorrectionCodewords: 1440,
        blocksStructure: [
          { numberOfBlocks: 29, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 19, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 898,
        numberOfErrorCorrectionCodewords: 1710,
        blocksStructure: [
          { numberOfBlocks: 11, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 46, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 56, 84, 112, 140],
  },
  {
    version: 34,
    size: 153,
    // functionPatternModules: 1251,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 22091,
    reminderBits: 3,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2188,
        numberOfErrorCorrectionCodewords: 570,
        blocksStructure: [
          { numberOfBlocks: 13, dataCodewordsPerBlock: 115 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 116 },
        ],
      },
      M: {
        maxMessageLength: 1722,
        numberOfErrorCorrectionCodewords: 1036,
        blocksStructure: [
          { numberOfBlocks: 14, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 23, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1228,
        numberOfErrorCorrectionCodewords: 1530,
        blocksStructure: [
          { numberOfBlocks: 44, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 958,
        numberOfErrorCorrectionCodewords: 1800,
        blocksStructure: [
          { numberOfBlocks: 59, dataCodewordsPerBlock: 16 },
          { numberOfBlocks: 1, dataCodewordsPerBlock: 17 },
        ],
      },
    },
    alignmentPatternPositions: [4, 32, 60, 88, 116, 144],
  },
  {
    version: 35,
    size: 157,
    // functionPatternModules: 1574,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 23008,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2303,
        numberOfErrorCorrectionCodewords: 570,
        blocksStructure: [
          { numberOfBlocks: 12, dataCodewordsPerBlock: 121 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 122 },
        ],
      },
      M: {
        maxMessageLength: 1809,
        numberOfErrorCorrectionCodewords: 1064,
        blocksStructure: [
          { numberOfBlocks: 12, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 26, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 1283,
        numberOfErrorCorrectionCodewords: 1590,
        blocksStructure: [
          { numberOfBlocks: 39, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 983,
        numberOfErrorCorrectionCodewords: 1890,
        blocksStructure: [
          { numberOfBlocks: 22, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 41, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 52, 76, 100, 124, 148],
  },
  {
    version: 36,
    size: 161,
    // functionPatternModules: 1582,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 24272,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2431,
        numberOfErrorCorrectionCodewords: 600,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 121 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 122 },
        ],
      },
      M: {
        maxMessageLength: 1911,
        numberOfErrorCorrectionCodewords: 1120,
        blocksStructure: [
          { numberOfBlocks: 6, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 34, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 1351,
        numberOfErrorCorrectionCodewords: 1680,
        blocksStructure: [
          { numberOfBlocks: 46, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 1051,
        numberOfErrorCorrectionCodewords: 1980,
        blocksStructure: [
          { numberOfBlocks: 2, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 64, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 22, 48, 74, 100, 126, 152],
  },
  {
    version: 37,
    size: 165,
    // functionPatternModules: 1590,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 25568,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2563,
        numberOfErrorCorrectionCodewords: 630,
        blocksStructure: [{ numberOfBlocks: 17, dataCodewordsPerBlock: 122 }],
      },
      M: {
        maxMessageLength: 1989,
        numberOfErrorCorrectionCodewords: 1204,
        blocksStructure: [
          { numberOfBlocks: 29, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1423,
        numberOfErrorCorrectionCodewords: 1770,
        blocksStructure: [
          { numberOfBlocks: 49, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 10, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 1093,
        numberOfErrorCorrectionCodewords: 2100,
        blocksStructure: [
          { numberOfBlocks: 24, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 46, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 26, 52, 78, 104, 130, 156],
  },
  {
    version: 38,
    size: 169,
    // functionPatternModules: 1598,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 26896,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2699,
        numberOfErrorCorrectionCodewords: 660,
        blocksStructure: [
          { numberOfBlocks: 4, dataCodewordsPerBlock: 122 },
          { numberOfBlocks: 18, dataCodewordsPerBlock: 123 },
        ],
      },
      M: {
        maxMessageLength: 2099,
        numberOfErrorCorrectionCodewords: 1260,
        blocksStructure: [
          { numberOfBlocks: 13, dataCodewordsPerBlock: 46 },
          { numberOfBlocks: 32, dataCodewordsPerBlock: 47 },
        ],
      },
      Q: {
        maxMessageLength: 1499,
        numberOfErrorCorrectionCodewords: 1860,
        blocksStructure: [
          { numberOfBlocks: 48, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 14, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 1139,
        numberOfErrorCorrectionCodewords: 2220,
        blocksStructure: [
          { numberOfBlocks: 42, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 32, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 30, 56, 82, 108, 134, 160],
  },
  {
    version: 39,
    size: 173,
    // functionPatternModules: 1606,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 28256,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2809,
        numberOfErrorCorrectionCodewords: 720,
        blocksStructure: [
          { numberOfBlocks: 20, dataCodewordsPerBlock: 117 },
          { numberOfBlocks: 4, dataCodewordsPerBlock: 118 },
        ],
      },
      M: {
        maxMessageLength: 2213,
        numberOfErrorCorrectionCodewords: 1316,
        blocksStructure: [
          { numberOfBlocks: 40, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 7, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 1579,
        numberOfErrorCorrectionCodewords: 1950,
        blocksStructure: [
          { numberOfBlocks: 43, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 22, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 1219,
        numberOfErrorCorrectionCodewords: 2310,
        blocksStructure: [
          { numberOfBlocks: 10, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 67, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 24, 52, 80, 108, 136, 164],
  },
  {
    version: 40,
    size: 177,
    // functionPatternModules: 1614,
    // formatInformationModules: 31,
    // versionInformationModules: 36,
    // dataModules: 29648,
    reminderBits: 0,
    errorCorrectionLevel: {
      L: {
        maxMessageLength: 2953,
        numberOfErrorCorrectionCodewords: 750,
        blocksStructure: [
          { numberOfBlocks: 19, dataCodewordsPerBlock: 118 },
          { numberOfBlocks: 6, dataCodewordsPerBlock: 119 },
        ],
      },
      M: {
        maxMessageLength: 2331,
        numberOfErrorCorrectionCodewords: 1372,
        blocksStructure: [
          { numberOfBlocks: 18, dataCodewordsPerBlock: 47 },
          { numberOfBlocks: 31, dataCodewordsPerBlock: 48 },
        ],
      },
      Q: {
        maxMessageLength: 1663,
        numberOfErrorCorrectionCodewords: 2040,
        blocksStructure: [
          { numberOfBlocks: 34, dataCodewordsPerBlock: 24 },
          { numberOfBlocks: 34, dataCodewordsPerBlock: 25 },
        ],
      },
      H: {
        maxMessageLength: 1273,
        numberOfErrorCorrectionCodewords: 2430,
        blocksStructure: [
          { numberOfBlocks: 20, dataCodewordsPerBlock: 15 },
          { numberOfBlocks: 61, dataCodewordsPerBlock: 16 },
        ],
      },
    },
    alignmentPatternPositions: [4, 28, 56, 84, 112, 140, 168],
  },
];
