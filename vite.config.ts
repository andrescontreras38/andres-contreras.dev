import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Los fragmentos manuales que habia aqui listaban react-router, framer-motion
    // y radix, que ya no forman parte del proyecto. El paquete es ahora tan
    // pequeno (React y poco mas) que dividirlo no aporta nada.
    sourcemap: mode === "development",
  },
}));
