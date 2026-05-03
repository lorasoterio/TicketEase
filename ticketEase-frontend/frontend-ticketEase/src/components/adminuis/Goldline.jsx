import React from "react";
import { Box } from "@mui/material";
export default function GoldLine() {
  return (
    <Box sx={{
      height: 3,
      background: "linear-gradient(90deg, #c9993a, transparent)",
      borderRadius: 1,
      mb: 2,
    }} />
  );
}