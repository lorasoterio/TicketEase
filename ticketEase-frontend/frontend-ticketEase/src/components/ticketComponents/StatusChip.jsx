import { Box, Typography } from "@mui/material";
const STATUS_COLORS = {
  Pending:        { bg: "#fff8e1", color: "#b45309" },
  Assigned:       { bg: "#e8f0fe", color: "#1a56db" },
  "In Progress":  { bg: "#dbeafe", color: "#1d4ed8" },
  "Ready for Pickup": { bg: "#ede9fe", color: "#6d28d9" },
  Completed:      { bg: "#e6f4ea", color: "#1e7e34" },
  Rejected:       { bg: "#fdecea", color: "#c0392b" },
  Open:           { bg: "#e0f7fa", color: "#0277bd" },
  Responded:      { bg: "#e8f5e9", color: "#2e7d32" },
  Closed:         { bg: "#f3f4f6", color: "#374151" },
};

export default function StatusChip({ label }) {
  const s = STATUS_COLORS[label] || { bg: "#f0f0f0", color: "#555" };
  return (
    <Box
      sx={{
        px: 1.2,
        py: 0.3,
        borderRadius: "20px",
        bgcolor: s.bg,
        display: "inline-block",
      }}
    >
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          color: s.color,
          fontFamily: "'Source Serif 4', serif",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}