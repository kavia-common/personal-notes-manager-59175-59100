import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "build/",
      "dist/",
      "*.log",
      "*.tmp",
      "*.tsbuildinfo",
      "coverage/",
      ".vscode/",
      ".idea/",
      "*.config.mjs",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Your custom rules here
    },
  },
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly",
        CustomEvent: "readonly",
        localStorage: "readonly",
        alert: "readonly",
        confirm: "readonly",
        queueMicrotask: "readonly",
        // timers
        setTimeout: "readonly",
        clearTimeout: "readonly",
        // Console
        console: "readonly",
      },
    },
  },
];
