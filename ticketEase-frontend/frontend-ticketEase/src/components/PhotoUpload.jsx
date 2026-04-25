import { Box, Button, Avatar, Stack } from "@mui/material";

export default function PhotoUpload({ photo, onUpload }) {
  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onUpload(file);
  }

  return (
    <Stack alignItems="center" spacing={1.5}>
      <Avatar
        src={photo || ""}
        sx={{ width: 80, height: 80 }}
      />

      <Button
        component="label"
        size="small"
        variant="outlined"
      >
        Upload Photo
        <input hidden type="file" accept="image/*" onChange={handleChange} />
      </Button>
    </Stack>
  );
}