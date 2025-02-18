import { languageOptions } from "./configs/eslint.language.mjs";
import { eslintCoreConfig } from "./configs/eslint.core.mjs";

export default [...eslintCoreConfig, languageOptions()];
