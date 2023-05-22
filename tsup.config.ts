import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!src/**/*.hbs'],
  splitting: false,
  minify: true,
  target: 'es2016',
});
