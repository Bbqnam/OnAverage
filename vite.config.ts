import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const localHost = "localhost";
const localPort = 8080;

export default defineConfig({
  plugins: [react()],
  server: {
    host: localHost,
    port: localPort,
    strictPort: true,
  },
  preview: {
    host: localHost,
    port: localPort,
    strictPort: true,
  },
});
