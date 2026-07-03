import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  // Ignore compiled and dependency files globally
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,

  ...tseslint.configs.recommended,

  eslintConfigPrettier,

  {
    files: ["**/*.{ts,tsx}"],

    ignores: ["dist/**"],

    languageOptions: {
      globals: globals.node,
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];