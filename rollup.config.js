import svelte from "rollup-plugin-svelte";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "frontend-src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js",
  },
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.includes("node_modules/svelte")) {
      return;
    }
    warn(warning);
  },
  plugins: [
    svelte({
      compilerOptions: { dev: !production },
    }),
    css({ output: "bundle.css" }),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: !production,
    }),
    babel({
      extensions: [".js", ".mjs", ".svelte", ".ts"],
      babelHelpers: "runtime",
      include: ["src/**", "node_modules/svelte/**"],
    }),
    resolve({ browser: true, dedupe: ["svelte"] }),
    commonjs(),
    !production && livereload("public"),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
