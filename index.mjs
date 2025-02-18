import { languageOptions } from "./eslint.language.mjs";
import { eslintCoreConfig } from "./eslint.core.mjs";

export default [...eslintCoreConfig, languageOptions()];
