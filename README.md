# 🌟 @dfinity/eslint-config-oisy-wallet

A shareable ESLint configuration library for Oisy Wallet projects, supporting both TypeScript and Svelte.

<div align="center" style="display:flex;flex-direction:column;">
<br/>

[![Internet Computer portal](https://img.shields.io/badge/Internet-Computer-grey?logo=internet%20computer)](https://internetcomputer.org)
[![GitHub CI Checks Workflow Status](https://img.shields.io/github/actions/workflow/status/dfinity/eslint-config-oisy-wallet/checks.yml?logo=github&label=CI%20checks)](https://github.com/dfinity/eslint-config-oisy-wallet/actions/workflows/checks.yml)

</div>

> [!NOTE]
> This configuration is currently compatible with ESLint 8.

## 🖥️ Installation

```bash
# with npm
npm install --save-dev @dfinity/eslint-config-oisy-wallet
# with pnpm
pnpm add --save-dev @dfinity/eslint-config-oisy-wallet
# with yarn
yarn add -D @dfinity/eslint-config-oisy-wallet
```

## ✍️ Usage

For General Projects (Non-Svelte):

1. Create an ESLint configuration file `.eslintrc.js` in your project root and extend the base configuration:

```javascript
module.exports = {
  extends: ["@dfinity/eslint-config-oisy-wallet"],
};
```

For [Svelte](https://svelte.dev/) Projects:

1. Create an `.eslintrc.js` file in your project root and extend the Svelte-specific configuration:

```javascript
module.exports = {
  extends: ["@dfinity/eslint-config-oisy-wallet/svelte"],
};
```

For [vitest](https://vitest.dev/) test suites:

1. Create an `.eslintrc.js` file in your project root and extend the vitest-specific configuration:

```javascript
module.exports = {
  extends: ["@dfinity/eslint-config-oisy-wallet/vitest"],
};
```

2. If the rules must apply ONLY to test files, they can be configured as:

```javascript
module.exports = {
    rules: {
        // Specify the test files and/or folders
        files: ['**/*.test.{ts,js}', '**/*.spec.{ts,js}', '**/tests/**/*.{ts,js}'],

        extends: ["@dfinity/eslint-config-oisy-wallet/vitest"],
    },
};
```

Finally, create an `eslint-local-rules.cjs` file at the root of your project containing the following:

```javascript
module.exports = require("@dfinity/eslint-config-oisy-wallet/eslint-local-rules");
```

> [!NOTE]
> This is necessary because the `eslint-plugin-local-rules` plugin we use for custom rules requires a file located at the root and does not offer any customizable location option.

## 🔧 Overriding or Disabling Rules

You can override or disable any of the rules provided by this configuration — including custom **local rules** — just like you would with any ESLint config.

In your `.eslintrc.js`, simply add a `rules` section:

```javascript
module.exports = {
  extends: ["@dfinity/eslint-config-oisy-wallet/svelte"],
  rules: {
    // Disable a built-in rule
    "no-console": "off",

    // Disable a local custom rule
    "local/use-nullish-checks": "off",

    // Customize severity or options
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
```

Note: To override local rules, make sure you have the `eslint-local-rules.cjs` file at the root as described above.

## 🛠️ TypeScript Support

If your project uses TypeScript, make sure you have a `tsconfig.json` file in your project root.

Here's an example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "*.svelte"],
  "exclude": ["node_modules", "dist"]
}
```

## 🔍 Linting Your Project

To lint your project, add the following script to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint --max-warnings 0 \"src/**/*\""
  }
}
```

Then, run the linting command:

```bash
npm run lint
```
