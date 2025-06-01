// jest.config.cjs

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/src/**/*.test.(ts|tsx)",
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  moduleNameMapper: {
    "^.+\\.css$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",

    "styled-system/css$": "<rootDir>/__mocks__/styled-system/css.ts",
    "\\.\\./styled-system/css$": "<rootDir>/__mocks__/styled-system/css.ts",
    "\\.\\.\\./styled-system/css$": "<rootDir>/__mocks__/styled-system/css.ts",
    ".*styled-system\\/css$": "<rootDir>/__mocks__/styled-system/css.ts"
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
};
