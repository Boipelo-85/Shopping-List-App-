import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // appType: 'spa' tells both the dev server and preview server to serve
  // index.html for any route that doesn't match a static file, fixing
  // the "page doesn't exist" 404 when refreshing on client-side routes
  // like /home, /profile, /shared/list/:id etc.
  appType: 'spa',
})
