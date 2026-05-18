import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const groqApiKey = env.GROQ_API_KEY || env.groq || env.VITE_GROQ_API_KEY || env.VITE_GROQ || '';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GROQ_API_KEY': JSON.stringify(groqApiKey),
        'process.env.groq': JSON.stringify(groqApiKey),
        'process.env.VITE_GROQ': JSON.stringify(groqApiKey),
        'process.env.VITE_GROQ_API_KEY': JSON.stringify(groqApiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
