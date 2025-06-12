import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/backend": {
        target: "https://og-oj-backend.onrender.com",
        secure: false,
      },
    },
  },
});
