import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteImagemin({
      pngquant: {
        quality: [0.65, 0.8],
        speed: 3,
      },
      optipng: {
        optimizationLevel: 3,
      },
    }),
  ],
})
