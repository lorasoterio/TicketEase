import { Paper, Typography } from "@mui/material";

export default function StatCard({ label, value, color }) {
  return (
    <Paper elevation={0} sx={{ bgcolor: "#f0f4f8", borderRadius: 2, p: 1.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: 600,
          color: color || "text.primary",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}