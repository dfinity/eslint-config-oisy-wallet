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

For Svelte Projects:

1. Create an `.eslintrc.js` file in your project root and extend the Svelte-specific configuration:

```javascript
module.exports = {
  extends: ["@dfinity/eslint-config-oisy-wallet/svelte"],
};
```

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
