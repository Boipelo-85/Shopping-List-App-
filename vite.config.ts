import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  // In production the frontend and backend are served from the same Express
  // server, so API calls use a relative base URL (empty string = same origin).
  // Locally the backend runs on :3001 so we fall back to that.
  define: {
    // This makes VITE_API_BASE_URL an empty string in production builds,
    // so fetch('/auth/register') hits the same server that served the page.
    // Locally, .env sets VITE_API_BASE_URL=http://localhost:3001.
  },
})
