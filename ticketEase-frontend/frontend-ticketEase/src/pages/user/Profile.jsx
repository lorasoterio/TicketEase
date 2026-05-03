import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  School,
  Email,
  Phone,
  Home,
  MenuBook,
  CalendarToday,
  Lock,
  VerifiedUser,
  Badge,
} from "@mui/icons-material";

import useProfile from "../../hooks/user/useProfile";
import PhotoUpload from "../../components/PhotoUpload";
import { dashboardTheme } from "../../components/themes/dashboardTheme";

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: "text.disabled", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", fontFamily: "'Source Serif 4', serif" }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "'Source Serif 4', serif" }}>
          {value || <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>Not provided</span>}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function Profile() {
  const {
    profile,
    loading,
    error,
    passwords,
    passwordError,
    passwordSuccess,
    updatePhoto,
    updatePasswordField,
    changePassword,
  } = useProfile();

  const initials = profile?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        {/* PAGE HEADER */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Badge sx={{ color: "#1a3a5c", fontSize: 22 }} />
          <Box>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ fontFamily: "'Playfair Display', serif" }}
            >
              My Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage your account information
            </Typography>
          </Box>
        </Stack>

        {/* ERROR STATE */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* ── LEFT COLUMN ── */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Identity card */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderTop: "4px solid #1a3a5c",
                  p: 3,
                }}
              >
                {loading ? (
                  <Stack spacing={1.5} alignItems="center">
                    <Skeleton variant="circular" width={80} height={80} />
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={90} height={18} />
                    <Skeleton variant="text" width={100} height={18} />
                  </Stack>
                ) : (
                  <Stack spacing={2} alignItems="center">
                    {profile?.photo ? (
                      <PhotoUpload photo={profile.photo} onUpload={updatePhoto} />
                    ) : (
                      <Stack alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#e8f0fe",
                            color: "#1a56db",
                            fontSize: 28,
                            fontWeight: 700,
                            fontFamily: "'Source Serif 4', serif",
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Button
                          component="label"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontFamily: "'Source Serif 4', serif",
                            borderColor: "#1a3a5c",
                            color: "#1a3a5c",
                            fontSize: "12px",
                            textTransform: "none",
                          }}
                        >
                          Upload Photo
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) updatePhoto(file);
                            }}
                          />
                        </Button>
                      </Stack>
                    )}

                    <Box textAlign="center">
                      <Typography
                        fontWeight={700}
                        sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}
                      >
                        {profile?.fullName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, fontFamily: "'Source Serif 4', serif" }}
                      >
                        {profile?.schoolStudentId}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        sx={{ mt: 1 }}
                      >
                        <Chip
                          icon={<VerifiedUser sx={{ fontSize: "14px !important" }} />}
                          label={profile?.isVerified ? "Verified" : "Unverified"}
                          size="small"
                          sx={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "11px",
                            bgcolor: profile?.isVerified ? "#e8f5e9" : "#fff8e1",
                            color: profile?.isVerified ? "#2e7d32" : "#b45309",
                            "& .MuiChip-icon": {
                              color: profile?.isVerified ? "#2e7d32" : "#b45309",
                            },
                          }}
                        />
                      </Stack>
                    </Box>

                    <Divider flexItem />

                    <Stack spacing={1.5} sx={{ width: "100%", px: 1 }}>
                      <InfoRow
                        icon={<MenuBook sx={{ fontSize: 18 }} />}
                        label="Course / Program"
                        value={profile?.courseProgram}
                      />
                      <InfoRow
                        icon={<CalendarToday sx={{ fontSize: 18 }} />}
                        label="Year Level"
                        value={profile?.yearLevel}
                      />
                      {joinedDate && (
                        <InfoRow
                          icon={<School sx={{ fontSize: 18 }} />}
                          label="Member Since"
                          value={joinedDate}
                        />
                      )}
                    </Stack>
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Grid>

          {/* ── RIGHT COLUMN ── */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {/* Contact Information */}
              <Paper
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", p: 2.5 }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    fontFamily: "'Playfair Display', serif",
                    color: "#1a3a5c",
                    fontSize: "0.95rem",
                  }}
                >
                  Contact Information
                </Typography>

                {loading ? (
                  <Stack spacing={1.5}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} variant="text" height={40} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <InfoRow
                      icon={<Email sx={{ fontSize: 18 }} />}
                      label="Email Address"
                      value={profile?.userEmail}
                    />
                    <InfoRow
                      icon={<Phone sx={{ fontSize: 18 }} />}
                      label="Contact Number"
                      value={profile?.contactNumber}
                    />
                    <InfoRow
                      icon={<Home sx={{ fontSize: 18 }} />}
                      label="Address"
                      value={profile?.address}
                    />
                  </Stack>
                )}
              </Paper>

              {/* Change Password */}
              <Paper
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", p: 2.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Lock sx={{ fontSize: 18, color: "#1a3a5c" }} />
                  <Typography
                    fontWeight={600}
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#1a3a5c",
                      fontSize: "0.95rem",
                    }}
                  >
                    Change Password
                  </Typography>
                </Stack>

                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => {}}>
                    Password updated successfully.
                  </Alert>
                )}
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}

                <Stack spacing={1.5}>
                  <TextField
                    type="password"
                    label="Current Password"
                    size="small"
                    value={passwords.current}
                    onChange={(e) => updatePasswordField("current", e.target.value)}
                    autoComplete="current-password"
                    InputProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                    InputLabelProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                  />
                  <TextField
                    type="password"
                    label="New Password"
                    size="small"
                    value={passwords.newPass}
                    onChange={(e) => updatePasswordField("newPass", e.target.value)}
                    autoComplete="new-password"
                    InputProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                    InputLabelProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                  />
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    size="small"
                    value={passwords.confirm}
                    onChange={(e) => updatePasswordField("confirm", e.target.value)}
                    autoComplete="new-password"
                    InputProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                    InputLabelProps={{ sx: { fontFamily: "'Source Serif 4', serif" } }}
                  />
                  <Box>
                    <Button
                      variant="contained"
                      onClick={changePassword}
                      sx={{
                        bgcolor: "#1a3a5c",
                        fontFamily: "'Source Serif 4', serif",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        "&:hover": { bgcolor: "#122a42" },
                        boxShadow: "0 2px 8px rgba(26,58,92,0.2)",
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}