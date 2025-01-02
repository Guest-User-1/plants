import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
  },
  // Add this for client-side routing
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
