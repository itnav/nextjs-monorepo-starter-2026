import { defineConfig } from "vite-plus";

/** `libs/utils` パッケージ用の Vite+ 設定（パック・リント等）。 */
export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
