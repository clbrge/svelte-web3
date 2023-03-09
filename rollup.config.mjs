import dts from "rollup-plugin-dts";

export default [
  {
    input: "./src/stores.js",
    output: [
      { file: "dist/index.mjs", format: "es" },
      { file: "dist/index.js", format: "umd", name: "web3store" },
    ]
  },
  {
    input: "./src/svelte-web3.d.ts",
    output: [{ file: "dist/svelte-web3.d.ts", format: "es" }],
    plugins: [dts()],
  },
]
