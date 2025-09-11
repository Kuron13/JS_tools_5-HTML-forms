import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        page: true,
        browser: true,
        context: true,
        describe: true,
        test: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        expect: true
      }
    },
    ignores: ["dist/*", "coverage/*", "e2e/reports/*"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "jest/no-conditional-expect": "off",
      "jest/valid-title": "error",
      "jest/expect-expect": "error",
      "jest/no-standalone-expect": "off"
    }
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,

  // Особые правила для e2e тестов
  {
    files: ["e2e/**/*.test.js", "e2e/**/*.spec.js"],
    rules: {
      "jest/expect-expect": "off",
      "jest/no-conditional-expect": "off",
      "jest/prefer-expect-assertions": "off",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error"
    }
  },

  // Особые правила для всех тестовых файлов
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-identical-title": "error",
      "jest/no-focused-tests": "error"
    }
  }
];
