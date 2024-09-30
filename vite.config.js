import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Replace 'my-vue-app' with your actual repository name
export default defineConfig({
  plugins: [vue()],
  base: '/speed-tracker/', // Adjust this line
});
