import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'cell-entering-hollywood-malta.trycloudflare.com', // Add Cloudflare tunnel URL here
      'localhost',
      '127.0.0.1'
    ]
  }
})
