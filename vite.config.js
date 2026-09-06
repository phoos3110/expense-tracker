import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.jpg'],
      manifest: {
        name: 'Expense Tracker',
        short_name: 'Expenses',
        description: 'Ứng dụng theo dõi chi tiêu cá nhân',
        theme_color: '#191919',
        background_color: '#191919',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: 'icon-512.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
          {
            src: 'icon-512-maskable.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})