import { FlatCompat } from "@eslint/eslintrc";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  }),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: { importX },
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
        },
      ],
      "importX/order": [
        "warn",
        { alphabetize: { order: "asc", caseInsensitive: false } },
      ],
    },
  },
  eslintPluginPrettierRecommended,
];

export default eslintConfig;
