export default [
  {
    input: "./src/web3-store.js",
    output: [
      { file: "dist/index.mjs", format: "es" },
      { file: "dist/index.js", format: "umd", name: "web3store" },
    ]
  },
]
