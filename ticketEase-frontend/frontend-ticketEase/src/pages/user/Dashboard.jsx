import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, Stack, Chip, Divider, Button, Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a3a5c" },
    secondary: { main: "#c9993a" },
    background: { default: "#f0f4f8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h5: { fontWeight: 700 },
    body1: { fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem" },
    body2: { fontFamily: "'Source Serif 4', serif", fontSize: "0.85rem" },
    button: { fontFamily: "'Source Serif 4', serif", fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
});

const STATUS_COLORS = {
  "In progress": { bg: "#e8f0fe", color: "#1a56db" },
  "Pending":     { bg: "#fff8e1", color: "#b45309" },
  "Completed":   { bg: "#e6f4ea", color: "#1e7e34" },
  "Rejected":    { bg: "#fdecea", color: "#c0392b" },
};

function StatusChip({ label }) {
  const s = STATUS_COLORS[label] || { bg: "#f0f0f0", color: "#555" };
  return (
    <Box sx={{ px: 1.2, py: 0.3, borderRadius: "20px", bgcolor: s.bg, display: "inline-block" }}>
      <Typography sx={{ fontSize: "11px", fontWeight: 600, color: s.color, fontFamily: "'Source Serif 4', serif" }}>
        {label}
      </Typography>
    </Box>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Paper elevation={0} sx={{ bgcolor: "#f0f4f8", borderRadius: 2, p: 1.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: "22px", fontWeight: 600, color: color || "text.primary", fontFamily: "'Playfair Display', serif" }}>
        {value}
      </Typography>
    </Paper>
  );
}

const MOCK_TICKETS = [
  { id: "#1042", subject: "Request for Form 137",               status: "In progress", date: "Mar 22, 2026", note: "1 unread reply" },
  { id: "#1058", subject: "Enrollment inquiry — 2nd semester",  status: "Pending",     date: "Mar 24, 2026", note: "Awaiting staff" },
  { id: "#0991", subject: "Certificate of enrollment request",  status: "Completed",   date: "Mar 10, 2026", note: "Mar 14" },
];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate    = useNavigate();
  const initials    = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ST";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1a56db", fontFamily: "'Source Serif 4', serif" }}>{initials}</Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>Student Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">{profile?.full_name || "Student"} — {profile?.student_id || ""}</Typography>
          </Box>
          <Button
            variant="outlined" size="small"
            onClick={() => navigate("/request-document")}
            sx={{ ml: "auto !important", fontFamily: "'Source Serif 4', serif", borderColor: "#1a3a5c", color: "#1a3a5c", fontSize: "12px" }}
          >
            Submit new ticket ↗
          </Button>
        </Stack>

        {/* Stat Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}><StatCard label="Total tickets" value="8" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="In progress"   value="3" color="#1a56db" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Completed"     value="4" color="#1e7e34" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Pending"       value="1" color="#b45309" /></Grid>
        </Grid>

        {/* My Tickets */}
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="body1" fontWeight={600}>My Tickets</Typography>
            <Typography variant="body2" color="text.secondary">Recent activity</Typography>
          </Stack>
          {MOCK_TICKETS.map((t, i) => (
            <Box key={t.id}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5 }}>
                <StatusChip label={t.status} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{t.subject}</Typography>
                  <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                    Submitted {t.date} · Ticket {t.id}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>{t.note}</Typography>
              </Stack>
              {i < MOCK_TICKETS.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Upload Documents</Typography>
              <Typography variant="body2" color="text.secondary">Attach requirements to open tickets</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Notifications</Typography>
              <Typography variant="body2" color="text.secondary">2 new updates from staff</Typography>
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
}