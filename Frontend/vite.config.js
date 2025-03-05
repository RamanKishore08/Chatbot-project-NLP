import { defineConfig } from 'vite';


export default defineConfig({
  server: {
    proxy: {
      "/chat": {
        target: "https://zeotapchatbot-2.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
