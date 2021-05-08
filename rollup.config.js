//import svelte from 'rollup-plugin-svelte';
//import resolve from '@rollup/plugin-node-resolve';
//import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const name = pkg.name
	  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	  .replace(/^\w/, m => m.toUpperCase())
	  .replace(/-\w/g, m => m[1].toUpperCase());

export default [
  {
    input: "./src/web3-store.js",
    output: [
      { file: "dist/index.mjs", format: "es" },
      { file: "dist/index.js", format: "umd", name: "web3store" },
    ],
    plugins: [json()]
  },
];
