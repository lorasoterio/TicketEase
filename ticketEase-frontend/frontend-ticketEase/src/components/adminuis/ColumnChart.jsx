import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * @param {Array<{label: string, v: number, gold?: boolean, dim?: boolean}>} data
 * @param {number} maxH - Maximum bar height in px, default = 80
 */
export default function ColumnChart({ data, maxH = 80 }) {
  const max = Math.max(...data.map(d => d.v || 0), 1);
  return (
    <Box sx={{
      display: "flex",
      alignItems: "flex-end",
      gap: 0.8,
      height: maxH + 20,
      pb: 0.5,
      borderBottom: "1px solid rgba(26,58,92,0.12)",
      mb: 1
    }}>
      {data.map((d, i) => (
        <Box key={i}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.4
          }}
        >
          <Box sx={{
            width: "100%",
            height: `${(d.v / max) * maxH}px`,
            bgcolor: d.gold ? "secondary.main" : "primary.main",
            borderRadius: "2px 2px 0 0",
            opacity: d.dim ? 0.65 : 1,
            "&:hover": { opacity: 0.75 },
            transition: "opacity 0.15s"
          }}/>
          <Typography sx={{ fontSize: 9, color: "text.secondary" }}>{d.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}