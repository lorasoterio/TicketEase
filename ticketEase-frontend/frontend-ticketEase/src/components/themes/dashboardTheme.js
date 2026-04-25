import { createTheme } from "@mui/material";

export const dashboardTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a3a5c" },
    secondary: { main: "#c9993a" },
    background: { default: "#f0f4f8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h5: { fontWeight: 700 },
    body1: { fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem" },
    body2: { fontFamily: "'Source Serif 4', serif", fontSize: "0.85rem" },
    button: { fontFamily: "'Source Serif 4', serif", fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
});