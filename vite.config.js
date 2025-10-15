import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        second: resolve(__dirname, "news.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        analysis: resolve(__dirname, "analysis.html"),
        portfolio: resolve(__dirname, "portfolio.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
