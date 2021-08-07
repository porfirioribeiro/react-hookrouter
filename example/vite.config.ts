/// <reference types="node" />
import path, { resolve } from 'path';

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

console.log(resolve(__dirname, '../dist'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      'react-hookrouter': resolve(__dirname, '../src'),
    },
  },
});
