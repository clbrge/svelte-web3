import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const name = pkg.name
	  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	  .replace(/^\w/, m => m.toUpperCase())
	  .replace(/-\w/g, m => m[1].toUpperCase());

export default {
  input: 'src/index.js',
  output: [
	{ file: pkg.module, 'format': 'es' },
	{ file: pkg.main, 'format': 'umd', name }
  ],
  moduleContext: {
    'node_modules/@ethersproject/properties/lib.esm/index.js': 'this'
  },
  plugins: [
	svelte(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      //preferBuiltins: false,
      dedupe: importee => [ 'svelte', 'bn.js' ].includes(importee) || importee
    }),
    json(),
    commonjs(),
  ]
};
