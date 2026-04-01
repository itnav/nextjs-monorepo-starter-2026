import { defineConfig } from "vite-plus";

/**
 * Vite-Plus の設定ファイル。
 */
export default defineConfig({
  fmt: {
    ignorePatterns: ["cspell.yaml", "_*/**"],
  },
  lint: {
    ignorePatterns: ["_*/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": "vp check --fix",
  },
});
