import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
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
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  eslintPluginPrettierRecommended,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
