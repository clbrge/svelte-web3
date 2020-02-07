import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';

const watch = process.env.ROLLUP_WATCH;

export default {
  input: 'example/main.js',
  output: {
	name: 'app',
	sourcemap: true,
	format: 'iife',
	file: 'public/build/bundle.js'
  },
  plugins: [
	svelte({
      css: css => {
        css.write('public/build/bundle.css');
      }
    }),
	resolve({
      dedupe: ['svelte']
	}),
	commonjs(),
	serve(),
    watch && livereload('public'),
  ],
  watch: {
	clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
	writeBundle() {
	  if (!started) {
		started = true;
		require('child_process').spawn('npm', ['run', 'start-example'], {
		  stdio: ['ignore', 'inherit', 'inherit'],
		  shell: true
		});
	  }
	}
  };
}
