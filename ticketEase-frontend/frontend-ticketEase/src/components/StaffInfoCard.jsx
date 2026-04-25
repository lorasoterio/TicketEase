import { Paper, Typography, Stack } from "@mui/material";

export default function StaffInfoCard({ staff }) {
  if (!staff) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Assigned Staff
      </Typography>

      <Stack spacing={0.5}>
        <Typography variant="body2">{staff.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {staff.department}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {staff.email}
        </Typography>
      </Stack>
    </Paper>
  );
}