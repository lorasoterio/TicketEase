import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";

export default function ChangePasswordCard({
  passwords,
  onChange,
  onSubmit,
}) {
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
      <Typography fontWeight={600} sx={{ mb: 2 }}>
        Change Password
      </Typography>

      <Stack spacing={1.5}>
        <TextField
          type="password"
          label="Current Password"
          size="small"
          value={passwords.current}
          onChange={(e) => onChange("current", e.target.value)}
        />

        <TextField
          type="password"
          label="New Password"
          size="small"
          value={passwords.newPass}
          onChange={(e) => onChange("newPass", e.target.value)}
        />

        <TextField
          type="password"
          label="Confirm Password"
          size="small"
          value={passwords.confirm}
          onChange={(e) => onChange("confirm", e.target.value)}
        />

        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{ textTransform: "none" }}
        >
          Update Password
        </Button>
      </Stack>
    </Paper>
  );
}