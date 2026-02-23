# ⚡ @dfinity/lint-config-oisy

A high-performance linting configuration for Oisy Wallet projects, powered by [Oxlint](https://oxlint.js.org/).

<div align="center" style="display:flex;flex-direction:column;">
<br/>

[![Internet Computer portal](https://img.shields.io/badge/Internet-Computer-grey?logo=internet%20computer)](https://internetcomputer.org)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-orange)](https://oxlint.js.org/)

</div>

> [!IMPORTANT]
> This library has migrated to **Oxlint**. It no longer requires or uses ESLint for its primary linting tasks.

## 🖥️ Installation

```bash
# with npm
npm install --save-dev @dfinity/lint-config-oisy oxlint
# with pnpm
pnpm add --save-dev @dfinity/lint-config-oisy oxlint
# with yarn
yarn add -D @dfinity/lint-config-oisy oxlint
```

## ✍️ Usage

This package provides a shareable Oxlint configuration. To use it in your project:

1. **Install Oxlint and the configuration:**

```bash
npm install --save-dev oxlint @dfinity/lint-config-oisy
```

2. **Extend the configuration in your `.oxlintrc.json`:**

```json
{
  "extends": ["@dfinity/lint-config-oisy/oxlintrc"]
}
```

3. **Add lint scripts to your `package.json`:**

```json
{
  "scripts": {
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix ."
  }
}
```

### 🧩 Architecture & Rules

This single configuration file handles **Main**, **Svelte**, and **Vitest** rules automatically using file-based overrides.

- **Vitest**: Rules are enabled for `**/*.test.{ts,js}` and `**/*.spec.{ts,js}`.
- **TypeScript/Svelte**: Supported natively with standard categories.

## 🔧 Enabled Categories

The following categories are enabled by default in this configuration:

- **Correctness**: `error` (Code that is definitely wrong or useless)
- **Suspicious**: `warn` (Code that is likely to be wrong or useless)
- **Perf**: `warn` (Rules that aim to improve runtime performance)

## 🧪 Vitest Support

This configuration includes built-in support for Vitest rules. They are automatically applied to files matching test patterns (e.g., `**/*.test.ts`, `**/*.spec.ts`).

## 🛠️ TypeScript & Svelte Support

Oxlint natively supports TypeScript and Svelte files. No additional configuration is needed beyond ensuring the plugins are listed in your `.oxlintrc.json`.

---

_Note: While legacy ESLint `.mjs` configs are still present for backward compatibility, they are no longer the recommended way to use this package._
