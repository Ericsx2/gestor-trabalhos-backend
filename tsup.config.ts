import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  splitting: false,
  minify: true,
  target: 'es2016',
});
