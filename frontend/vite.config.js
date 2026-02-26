import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        // Default to 5050 since 5000/5001 are commonly occupied on dev machines.
        // Override by setting VITE_BACKEND_URL in your shell env if needed.
        target: process.env.VITE_BACKEND_URL || "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});
