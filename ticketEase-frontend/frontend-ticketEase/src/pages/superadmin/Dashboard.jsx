import { useState, useEffect } from "react";
import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, Stack, Divider, Button, Grid, CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAllTickets } from "../../services/ticketsService";
import { getAllStaff, getAllStudents } from "../../services/userService";
import { getAuditLogs } from "../../services/auditLogService";

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

function formatLogTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return `${date.toLocaleDateString()} ${time}`;
}

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "SA";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    adminAccounts: 0,
    activeTickets: 0,
    ticketsThisMonth: 0,
    resolutionRate: "—",
    avgProcessingTime: "—",
  });
  const [staffList, setStaffList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [ticketsResult, staffResult, studentsResult, logsResult] = await Promise.allSettled([
          getAllTickets(),
          getAllStaff(),
          getAllStudents(),
          getAuditLogs(),
        ]);

        // ── Tickets ──────────────────────────────────────────────
        const tickets = ticketsResult.status === "fulfilled" && ticketsResult.value.data
          ? ticketsResult.value.data
          : [];

        const activeStatuses = ["Pending", "Assigned", "In Progress", "Responded", "Ready for Pickup"];
        const activeTickets = tickets.filter(t => activeStatuses.includes(t.status)).length;

        const now = new Date();
        const ticketsThisMonth = tickets.filter(t => {
          const d = new Date(t.createdAt);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }).length;

        const closedTickets = tickets.filter(t => t.status === "Closed");
        const resolutionRate = tickets.length > 0
          ? `${Math.round((closedTickets.length / tickets.length) * 100)}%`
          : "—";

        const avgProcessingTime = closedTickets.length > 0
          ? (() => {
              const avg = closedTickets.reduce((sum, t) => {
                const days = (new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
                return sum + days;
              }, 0) / closedTickets.length;
              return `${avg.toFixed(1)} days`;
            })()
          : "—";

        // ── Staff ─────────────────────────────────────────────────
        const staff = staffResult.status === "fulfilled" && Array.isArray(staffResult.value)
          ? staffResult.value
          : [];
        const adminAccounts = staff.length;
        setStaffList(staff.slice(0, 5));

        // ── Students ──────────────────────────────────────────────
        const students = studentsResult.status === "fulfilled" && Array.isArray(studentsResult.value)
          ? studentsResult.value
          : [];

        // ── Audit logs ────────────────────────────────────────────
        const logs = logsResult.status === "fulfilled" && logsResult.value.data
          ? logsResult.value.data
          : [];
        setActivityLogs(logs.slice(0, 4));

        setStats({
          totalStudents: students.length,
          adminAccounts,
          activeTickets,
          ticketsThisMonth,
          resolutionRate,
          avgProcessingTime,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>

        {/* Header */}
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#3C3489", fontFamily: "'Source Serif 4', serif" }}>{initials}</Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Super Admin Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">System overview — full access</Typography>
            </Box>
          </Stack>
          <Box sx={{ ml: { sm: "auto !important" }, px: 1.5, py: 0.4, borderRadius: "20px", bgcolor: "#EEEDFE" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#3C3489", fontFamily: "'Source Serif 4', serif" }}>Super Admin</Typography>
          </Box>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} sx={{ color: "#1a3a5c" }} />
          </Box>
        ) : (
          <>
            {/* Stat Cards */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}><StatCard label="Total students"     value={stats.totalStudents.toLocaleString()} /></Grid>
              <Grid item xs={6} sm={3}><StatCard label="Admin accounts"     value={stats.adminAccounts} /></Grid>
              <Grid item xs={6} sm={3}><StatCard label="Active tickets"     value={stats.activeTickets} color="#1a56db" /></Grid>
              <Grid item xs={6} sm={3}><StatCard label="Tickets this month" value={stats.ticketsThisMonth} /></Grid>
            </Grid>

            {/* Two column — Account Management + Activity Log */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>

              {/* Account Management */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body1" fontWeight={600}>Account Management</Typography>
                  </Box>
                  {staffList.length === 0 ? (
                    <Box sx={{ px: 2, py: 2 }}>
                      <Typography variant="body2" color="text.secondary">No admin accounts found.</Typography>
                    </Box>
                  ) : (
                    staffList.map((a, i) => (
                      <Box key={a.staffId ?? i}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{a.fullName}</Typography>
                            <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                              {a.department} — {a.isActive ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            sx={{ fontSize: "11px", fontFamily: "'Source Serif 4', serif" }}
                            onClick={() => navigate("/superadmin/manage-admins")}
                          >
                            Edit
                          </Button>
                        </Stack>
                        {i < staffList.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                  <Divider />
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Button
                      fullWidth size="small" variant="outlined"
                      sx={{ fontSize: "12px", fontFamily: "'Source Serif 4', serif", borderColor: "#1a3a5c", color: "#1a3a5c" }}
                      onClick={() => navigate("/superadmin/manage-admins")}
                    >
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
                  {activityLogs.length === 0 ? (
                    <Box sx={{ px: 2, py: 2 }}>
                      <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
                    </Box>
                  ) : (
                    activityLogs.map((log, i) => (
                      <Box key={log.logId ?? i}>
                        <Box sx={{ px: 2, py: 1.2 }}>
                          <Typography variant="body2" fontWeight={500}>{log.actionType}</Typography>
                          <Typography sx={{ fontSize: "11px", color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}>
                            {log.userEmail} · {formatLogTime(log.createdAt)}
                          </Typography>
                        </Box>
                        {i < activityLogs.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
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
                  <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#1e7e34", fontFamily: "'Playfair Display', serif" }}>{stats.resolutionRate}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ p: 2, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Avg. processing time</Typography>
                  <Typography sx={{ fontSize: "18px", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{stats.avgProcessingTime}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>System status</Typography>
                  <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#1e7e34", fontFamily: "'Playfair Display', serif" }}>Online</Typography>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

      </Box>
    </ThemeProvider>
  );
}