import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  Email,
  Phone,
  WorkOutlined,
  BusinessOutlined,
  CalendarToday,
  Lock,
  PersonOutline,
} from "@mui/icons-material";
import GoldLine from "../../components/adminuis/Goldline";
import CardTitle from "../../components/adminuis/CardTitle";
import useAdminProfile from "../../hooks/admin/useAdminProfile";

const ACCENT       = "#0a6d47";
const ACCENT_LIGHT = "#ecfdf5";
const ACCENT_MID   = "#d1fae5";

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: "text.disabled", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: "text.disabled", display: "block", fontSize: 11 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {value || <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>Not provided</span>}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function AdminProfile() {
  const {
    profile,
    loading,
    error,
    passwords,
    passwordError,
    passwordSuccess,
    updatePasswordField,
    changePassword,
  } = useAdminProfile();

  const initials = profile?.fullName
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "ST";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Box>
      <GoldLine />

      {/* Page header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <PersonOutline sx={{ color: ACCENT, fontSize: 22 }} />
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
            My Profile
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            View and manage your account information
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* ── LEFT COLUMN ── */}
        <Grid item xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{
              borderColor: "rgba(26,58,92,0.12)",
              borderTop: `4px solid ${ACCENT}`,
            }}
          >
            <CardContent>
              {loading ? (
                <Stack spacing={1.5} alignItems="center">
                  <Skeleton variant="circular" width={80} height={80} />
                  <Skeleton variant="text" width={130} height={24} />
                  <Skeleton variant="text" width={100} height={18} />
                  <Skeleton variant="text" width={110} height={18} />
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: ACCENT_MID,
                      color: ACCENT,
                      fontSize: 28,
                      fontWeight: 700,
                      borderRadius: "16px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Box textAlign="center">
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {profile?.fullName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, fontSize: 12 }}
                    >
                      {profile?.position}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        label="Staff"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10.5,
                          fontWeight: 700,
                          bgcolor: ACCENT_LIGHT,
                          color: ACCENT,
                          border: "1px solid",
                          borderColor: ACCENT_MID,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                      {profile?.isActive !== undefined && (
                        <Chip
                          label={profile.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10.5,
                            fontWeight: 700,
                            bgcolor: profile.isActive ? "#e8f5e9" : "#fce4ec",
                            color: profile.isActive ? "#2e7d32" : "#c62828",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider flexItem />

                  <Stack spacing={1.5} sx={{ width: "100%" }}>
                    <InfoRow
                      icon={<BusinessOutlined sx={{ fontSize: 18 }} />}
                      label="Department"
                      value={profile?.department}
                    />
                    <InfoRow
                      icon={<WorkOutlined sx={{ fontSize: 18 }} />}
                      label="Position"
                      value={profile?.position}
                    />
                    {joinedDate && (
                      <InfoRow
                        icon={<CalendarToday sx={{ fontSize: 18 }} />}
                        label="Member Since"
                        value={joinedDate}
                      />
                    )}
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── RIGHT COLUMN ── */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {/* Contact Information */}
            <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
              <CardContent>
                <CardTitle>Contact Information</CardTitle>
                {loading ? (
                  <Stack spacing={1.5}>
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} variant="text" height={40} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2} sx={{ mt: 1.5 }}>
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
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Lock sx={{ fontSize: 18, color: ACCENT }} />
                  <CardTitle sx={{ mb: 0 }}>Change Password</CardTitle>
                </Stack>

                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
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
                  />
                  <TextField
                    type="password"
                    label="New Password"
                    size="small"
                    value={passwords.newPass}
                    onChange={(e) => updatePasswordField("newPass", e.target.value)}
                    autoComplete="new-password"
                  />
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    size="small"
                    value={passwords.confirm}
                    onChange={(e) => updatePasswordField("confirm", e.target.value)}
                    autoComplete="new-password"
                  />
                  <Box>
                    <Button
                      variant="contained"
                      onClick={changePassword}
                      sx={{
                        bgcolor: ACCENT,
                        textTransform: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        "&:hover": { bgcolor: "#085c3a" },
                        boxShadow: "0 2px 8px rgba(10,109,71,0.2)",
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
