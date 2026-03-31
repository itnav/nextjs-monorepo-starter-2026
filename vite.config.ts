import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    enabled: true,
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    "*": "vp check --fix",
  },
});
