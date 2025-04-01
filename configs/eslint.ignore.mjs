import { join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { nonNullish } from "@dfinity/utils";
import { includeIgnoreFile } from "@eslint/compat";

const resolveGitIgnorePath = () => {
  const gitIgnore = join(process.cwd(), ".gitignore");

  if (existsSync(gitIgnore)) {
    return fileURLToPath(new URL(gitIgnore, import.meta.url));
  }

  return undefined;
};

const gitignorePath = resolveGitIgnorePath();

export const eslintIgnore = [
  ...(nonNullish(gitignorePath) ? [includeIgnoreFile(gitignorePath)] : []),
];
