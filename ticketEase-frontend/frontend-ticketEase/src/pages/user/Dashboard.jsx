import {
  ThemeProvider,
  CssBaseline,
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import useDashboard from "../../hooks/user/useDashboard";
import { dashboardTheme } from "../../components/themes/dashboardTheme";
import StatusChip  from "../../components/ticketComponents/StatusChip";
import StatCard  from "../../components/ticketComponents/StatCard";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { loading, error, stats, recentTickets } = useDashboard();

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error)
    return <Typography sx={{ p: 3, color: "error.main" }}>{error}</Typography>;

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap"
        rel="stylesheet"
      />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        {/* Header */}
<<<<<<< Updated upstream
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#e8f0fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1a56db",
                  fontFamily: "'Source Serif 4', serif",
                }}
              >
                {initials}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Student Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.full_name || "Student"} — {profile?.student_id || ""}
              </Typography>
            </Box>
          </Stack>
=======
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#e8f0fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1a56db",
                fontFamily: "'Source Serif 4', serif",
              }}
            >
              {initials}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Student Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.full_name || "Student"} — {profile?.student_id || ""}
            </Typography>
          </Box>
>>>>>>> Stashed changes
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/request-ticket")}
            sx={{
<<<<<<< Updated upstream
              ml: { sm: "auto !important" },
=======
              ml: "auto !important",
>>>>>>> Stashed changes
              fontFamily: "'Source Serif 4', serif",
              borderColor: "#1a3a5c",
              color: "#1a3a5c",
              fontSize: "12px",
            }}
          >
            Submit new ticket ↗
          </Button>
        </Stack>

        {/* Stat Cards */}
        <Grid container spacing={2}>
          {/* Stat Cards */}
          <Grid item xs={6} sm={3}>
            
            <StatCard label="Total tickets" value={stats.total} />
          </Grid>

          <Grid item xs={6} sm={3}>

            <StatCard
              label="In progress"
              value={stats.in_progress}
              color="#1a56db"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCard
              label="Completed"
              value={stats.completed}
              color="#1e7e34"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCard label="Pending" value={stats.pending} color="#b45309" />
          </Grid>
        </Grid>

        {/* My Tickets */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              My Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent activity
            </Typography>
          </Stack>
          {recentTickets.map((t, i) => (
            <Box key={t.id}>
              <Stack
<<<<<<< Updated upstream
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={{ xs: 0.5, sm: 1.5 }}
                sx={{ px: 2, py: 1.5 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" }, flex: { sm: 1 } }}>
                  <StatusChip label={t.status} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {t.subject}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "text.secondary",
                        fontFamily: "'Source Serif 4', serif",
                      }}
                    >
                      Submitted {t.date} · Ticket {t.id}
                    </Typography>
                  </Box>
                </Stack>
=======
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ px: 2, py: 1.5 }}
              >
                <StatusChip label={t.status} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {t.subject}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "text.secondary",
                      fontFamily: "'Source Serif 4', serif",
                    }}
                  >
                    Submitted {t.date} · Ticket {t.id}
                  </Typography>
                </Box>
>>>>>>> Stashed changes
              </Stack>
              {i < recentTickets.length - 1 && <Divider />}
            </Box>
          ))}

          {recentTickets.length === 0 && (
            <Typography
              sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
            >
              No tickets yet.
            </Typography>
          )}
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Upload Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attach requirements to open tickets
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 new updates from staff
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
