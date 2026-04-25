import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
} from "@mui/material";

import useProfile from "../../hooks/user/useProfile";
import PhotoUpload from "../../components/PhotoUpload";
import ContactInfoCard from "../../components/ContactInfoCard";
import ChangePasswordCard from "../../components/ChangePasswordCard";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f0f4f8", paper: "#ffffff" },
  },
});

export default function Profile() {
  const {
    profile,
    passwords,
    updatePhoto,
    updatePasswordField,
    changePassword,
  } = useProfile();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
        {/* HEADER */}
        <Typography fontWeight={600} sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Grid container spacing={2}>
          {/* LEFT */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={2} alignItems="center">
                <PhotoUpload
                  photo={profile.photo}
                  onUpload={updatePhoto}
                />

                <Box textAlign="center">
                  <Typography fontWeight={600}>
                    {profile.full_name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {profile.student_id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {profile.department}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* RIGHT */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <ContactInfoCard profile={profile} />

              <ChangePasswordCard
                passwords={passwords}
                onChange={updatePasswordField}
                onSubmit={changePassword}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}