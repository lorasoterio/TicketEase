import { Box, Typography } from "@mui/material";
const STATUS_COLORS = {
  "In progress": { bg: "#e8f0fe", color: "#1a56db" },
  Pending: { bg: "#fff8e1", color: "#b45309" },
  Completed: { bg: "#e6f4ea", color: "#1e7e34" },
  Rejected: { bg: "#fdecea", color: "#c0392b" },
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