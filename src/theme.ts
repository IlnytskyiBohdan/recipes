import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#E65100", light: "#FF833A", dark: "#AC1900", contrastText: "#fff" },
      secondary: { main: "#F9A825", contrastText: "#fff" },
      ...(mode === "light"
        ? { background: { default: "#FAFAF8", paper: "#FFFFFF" } }
        : { background: { default: "#121212", paper: "#1E1E1E" } }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: { root: { boxShadow: "0 2px 12px rgba(0,0,0,0.08)" } },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundColor: "#E65100" } },
      },
    },
  });

export default getTheme("light");
