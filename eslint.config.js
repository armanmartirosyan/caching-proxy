const { defineConfig } = require("eslint/config");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");

module.exports = defineConfig([
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
                ecmaVersion: "latest",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            import: importPlugin,
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 2],

            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/naming-convention": "error",

            "import/order": [
                "error",
                {
                    groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
                    "newlines-between": "always",
                },
            ],
            "import/no-unresolved": "off",

            "no-console": "off",
            "no-debugger": "error",
            "prefer-const": "error",
        },
    },
    {
        files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
        rules: {
            "no-console": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },
]);
