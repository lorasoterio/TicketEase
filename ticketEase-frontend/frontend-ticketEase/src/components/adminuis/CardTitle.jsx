import React from "react";
import { Box, Typography } from "@mui/material";

export default function CardTitle({ children, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5,
        pb: 1,
        borderBottom: "1px solid rgba(26,58,92,0.12)"
      }}
    >
      <Typography variant="h6" sx={{ fontSize: 13, color: "primary.main" }}>
        {children}
      </Typography>
      {action}
    </Box>
  );
}