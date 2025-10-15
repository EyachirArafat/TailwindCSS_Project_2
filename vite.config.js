import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dashboard: resolve(__dirname, "pages/dashboard.html"),
        news: resolve(__dirname, "pages/news.html"),
        portfolio: resolve(__dirname, "pages/portfolio.html"),
        analysis: resolve(__dirname, "pages/analysis.html"),
        contact: resolve(__dirname, "pages/contact.html"),
        about: resolve(__dirname, "pages/about.html"),
        settings: resolve(__dirname, "pages/settings.html"),
        login: resolve(__dirname, "pages/login.html"),
      },
    },
  },
});
