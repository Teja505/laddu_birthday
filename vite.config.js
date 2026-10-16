import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path must match the GitHub repo name so assets resolve correctly on
// https://<user>.github.io/laddu_birthday/
export default defineConfig({
  plugins: [react()],
  base: '/laddu_birthday/',
});
