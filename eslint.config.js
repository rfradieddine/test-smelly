import globals from 'globals';
import js from '@eslint/js';
import jest from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      jest
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-identical-title": "error"
    }
  }
];
