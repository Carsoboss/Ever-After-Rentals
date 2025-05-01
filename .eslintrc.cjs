/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    // @ts-ignore
    "@typescript-eslint",
    // @ts-ignore
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    // Remove these strict TypeScript rules that conflict with your tsconfig.json
    // "plugin:@typescript-eslint/recommended-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    
    // Keep the Drizzle-specific rules
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error", 
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ]
  }
}
module.exports = config;