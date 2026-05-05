import React from "react";
import { Chip } from "@mui/material";

// Status-color mapping for default statuses
const statusMap = {
  Urgent:   { bg: "#fee2e2", color: "#b91c1c" },
  Pending:  { bg: "#fef3c7", color: "#b45309" },
  Closed:   { bg: "#e8f5e9", color: "#2e7d32" },
  Active:   { bg: "#e8f5e9", color: "#2e7d32" },
  Inactive: { bg: "#fee2e2", color: "#b91c1c" },
  Healthy:  { bg: "#e8f5e9", color: "#2e7d32" },
};

export default function StatusChip({ status }) {
  const styles = statusMap[status] || { bg: "#f0f4f8", color: "#5a6a7e" };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: styles.bg,
        color: styles.color,
        fontWeight: 700,
        fontSize: 10,
        height: 20,
        px: 0.5,
      }}
    />
  );
}