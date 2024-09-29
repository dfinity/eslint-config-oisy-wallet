import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./rule-tester-setup.ts",
  },
});
