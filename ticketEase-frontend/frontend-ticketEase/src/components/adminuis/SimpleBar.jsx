import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * @param {string} label
 * @param {number} pct - percent, 0-100
 * @param {string} color - color string or theme key default is "primary.main"
 */
export default function SimpleBar({ label, pct, color = "primary.main" }) {
  return (
    <Box sx={{ mb: 1.2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{label}</Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{pct}%</Typography>
      </Box>
      <Box sx={{ height: 6, bgcolor: "rgba(26,58,92,0.12)", borderRadius: 1, overflow: "hidden" }}>
        <Box sx={{
          width: `${pct}%`,
          height: "100%",
          bgcolor: color,
          borderRadius: 1
        }}/>
      </Box>
    </Box>
  );
}