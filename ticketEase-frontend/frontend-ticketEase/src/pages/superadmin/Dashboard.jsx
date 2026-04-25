import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, Stack, Divider, Button, Grid,
} from "@mui/material";
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

const MOCK_ADMINS = [
  { name: "Ms. Aquino",    dept: "Registrar",      status: "Active" },
  { name: "Mr. Dela Cruz", dept: "Finance Office",  status: "Active" },
];

const MOCK_LOGS = [
  { action: "Ticket #1064 approved",   actor: "Ms. Aquino",  time: "Today 10:42 AM" },
  { action: "New student registered",  actor: "System",       time: "Today 9:15 AM" },
  { action: "Admin account created",   actor: "Super admin",  time: "Yesterday 4:02 PM" },
  { action: "Ticket #1049 rejected",   actor: "Mr. Dela Cruz", time: "Yesterday 2:30 PM" },
];

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const initials    = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "SA";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#3C3489", fontFamily: "'Source Serif 4', serif" }}>{initials}</Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>Super Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">System overview — full access</Typography>
          </Box>
          <Box sx={{ ml: "auto !important", px: 1.5, py: 0.4, borderRadius: "20px", bgcolor: "#EEEDFE" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#3C3489", fontFamily: "'Source Serif 4', serif" }}>Super Admin</Typography>
          </Box>
        </Stack>

        {/* Stat Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}><StatCard label="Total students"     value="1,248" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Admin accounts"     value="6" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Active tickets"     value="34"  color="#1a56db" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Tickets this month" value="187" /></Grid>
        </Grid>

        {/* Two column — Account Management + Activity Log */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>

          {/* Account Management */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="body1" fontWeight={600}>Account Management</Typography>
              </Box>
              {MOCK_ADMINS.map((a, i) => (
                <Box key={a.name}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{a.name}</Typography>
                      <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                        {a.dept} — {a.status}
                      </Typography>
                    </Box>
                    <Button size="small" sx={{ fontSize: "11px", fontFamily: "'Source Serif 4', serif" }}>Edit</Button>
                  </Stack>
                  {i < MOCK_ADMINS.length - 1 && <Divider />}
                </Box>
              ))}
              <Divider />
              <Box sx={{ px: 2, py: 1.5 }}>
                <Button fullWidth size="small" variant="outlined"
                  sx={{ fontSize: "12px", fontFamily: "'Source Serif 4', serif", borderColor: "#1a3a5c", color: "#1a3a5c" }}>
                  + Add admin account ↗
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Activity Log */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="body1" fontWeight={600}>Activity Log</Typography>
              </Box>
              {MOCK_LOGS.map((log, i) => (
                <Box key={i}>
                  <Box sx={{ px: 2, py: 1.2 }}>
                    <Typography variant="body2" fontWeight={500}>{log.action}</Typography>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                      {log.actor} · {log.time}
                    </Typography>
                  </Box>
                  {i < MOCK_LOGS.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          </Grid>

        </Grid>

        {/* System Monitoring */}
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="body1" fontWeight={600}>System Monitoring</Typography>
          </Box>
          <Grid container>
            <Grid item xs={12} sm={4} sx={{ p: 2, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Ticket resolution rate</Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#1e7e34", fontFamily: "'Playfair Display', serif" }}>91%</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ p: 2, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Avg. processing time</Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>1.8 days</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>System status</Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#1e7e34", fontFamily: "'Playfair Display', serif" }}>Online</Typography>
            </Grid>
          </Grid>
        </Paper>

      </Box>
    </ThemeProvider>
  );
}