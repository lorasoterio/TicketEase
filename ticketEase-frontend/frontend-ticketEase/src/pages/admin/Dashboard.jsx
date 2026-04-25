import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, Stack, Divider, Button, Grid,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";

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

function StatusBadge({ label, color, bg }) {
  return (
    <Box sx={{ px: 1.2, py: 0.3, borderRadius: "20px", bgcolor: bg, display: "inline-block" }}>
      <Typography sx={{ fontSize: "11px", fontWeight: 600, color, fontFamily: "'Source Serif 4', serif" }}>{label}</Typography>
    </Box>
  );
}

const MOCK_QUEUE = [
  { id: "#1064", subject: "Transcript request",          student: "Ana Cruz",    date: "Mar 25, 2026", status: "New",         statusColor: "#b45309", statusBg: "#fff8e1" },
  { id: "#1055", subject: "Good moral certificate",      student: "Marco Reyes", date: "Mar 23, 2026", status: "In progress", statusColor: "#1a56db", statusBg: "#e8f0fe" },
  { id: "#1063", subject: "Enrollment inquiry",          student: "Pia Santos",  date: "Mar 25, 2026", status: "New",         statusColor: "#b45309", statusBg: "#fff8e1" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const initials    = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "AD";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#e6f4ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e7e34", fontFamily: "'Source Serif 4', serif" }}>{initials}</Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>Admin / Staff Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">{profile?.full_name || "Admin"} — {profile?.department || "Office"}</Typography>
          </Box>
          <Box sx={{ ml: "auto !important", px: 1.5, py: 0.4, borderRadius: "20px", bgcolor: "#fdecea" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#c0392b", fontFamily: "'Source Serif 4', serif" }}>5 new tickets</Typography>
          </Box>
        </Stack>

        {/* Stat Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}><StatCard label="Open tickets"   value="12" color="#c0392b" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="In progress"    value="7"  color="#1a56db" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Resolved today" value="9"  color="#1e7e34" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Avg. response"  value="1.4d" /></Grid>
        </Grid>

        {/* Incoming Queue */}
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="body1" fontWeight={600}>Incoming Queue</Typography>
            <Typography variant="body2" color="text.secondary">Sorted by date received</Typography>
          </Stack>
          {MOCK_QUEUE.map((t, i) => (
            <Box key={t.id}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5 }}>
                <StatusBadge label={t.status} color={t.statusColor} bg={t.statusBg} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{t.subject} — {t.student}</Typography>
                  <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                    Submitted {t.date} · Ticket {t.id}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.8}>
                  {t.status === "New" ? (
                    <>
                      <Button size="small" sx={{ fontSize: "11px", color: "#1e7e34", fontFamily: "'Source Serif 4', serif", minWidth: 0 }}>Approve</Button>
                      <Button size="small" sx={{ fontSize: "11px", color: "#c0392b", fontFamily: "'Source Serif 4', serif", minWidth: 0 }}>Reject</Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" sx={{ fontSize: "11px", fontFamily: "'Source Serif 4', serif", minWidth: 0 }}>Update status</Button>
                      <Button size="small" sx={{ fontSize: "11px", fontFamily: "'Source Serif 4', serif", minWidth: 0 }}>Reply</Button>
                    </>
                  )}
                </Stack>
              </Stack>
              {i < MOCK_QUEUE.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        {/* Quick Tools */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Unread Comments</Typography>
              <Typography variant="body2" color="text.secondary">4 student replies</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Ticket History</Typography>
              <Typography variant="body2" color="text.secondary">Browse all processed</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Document Workflow</Typography>
              <Typography variant="body2" color="text.secondary">Manage processing steps</Typography>
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
}