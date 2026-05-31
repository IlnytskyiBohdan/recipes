import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/recipes/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": ["@mui/material", "@mui/icons-material", "@mui/system"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-misc": ["zustand", "lodash"],
        },
      },
    },
  },
});
