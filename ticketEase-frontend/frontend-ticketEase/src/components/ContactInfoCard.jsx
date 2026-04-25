import { Paper, Typography, Stack } from "@mui/material";

export default function ContactInfoCard({ profile }) {
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
      <Typography fontWeight={600} sx={{ mb: 1 }}>
        Contact Information
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2">
          Email: {profile.email}
        </Typography>

        <Typography variant="body2">
          Phone: {profile.phone}
        </Typography>
      </Stack>
    </Paper>
  );
}