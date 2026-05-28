import React from "react";
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";
import SimpleBar from "../../components/adminuis/SimpleBar";
import ColumnChart from "../../components/adminuis/ColumnChart";
import useAdminDashboard from "../../hooks/admin/useAdminDashboard";

export default function Dashboard() {
  const { loading, error, stats, recentTickets, categories, weekData, activity } = useAdminDashboard();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error.main" sx={{ fontSize: 13 }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <GoldLine />
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {stats.map((s, i) => (
          <Grid item xs={3} key={i}>
            <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
              <CardContent sx={{ p: "14px 16px !important" }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>{s.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {i === 0 && <Box sx={{ width: 3, height: 28, bgcolor: "secondary.main", borderRadius: 1, mr: 1 }} />}
                  <Typography variant="h4" sx={{ fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>{s.sub}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle action={<Typography sx={{ fontSize: 11, color: "text.secondary" }}>Today</Typography>}>Recent Tickets</CardTitle>
              {recentTickets.map((t, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 1, borderBottom: i < recentTickets.length - 1 ? "1px solid rgba(26,58,92,0.08)" : "none" }}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", minWidth: 60 }}>{t.id}</Typography>
                  <Typography sx={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</Typography>
                  <StatusChip status={t.status} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle>Tickets by Category</CardTitle>
              {categories.map((c, i) => (
                <SimpleBar
                  key={i}
                  label={c.label}
                  pct={c.pct}
                  color={i >= 2 ? "secondary.main" : undefined}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle>Weekly Volume</CardTitle>
              <ColumnChart data={weekData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle>Recent Activity</CardTitle>
              {activity.map((a, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.2, py: 0.9, borderBottom: i < activity.length - 1 ? "1px solid rgba(26,58,92,0.08)" : "none", alignItems: "flex-start" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: a.color, mt: 0.5, flexShrink: 0 }} />
                  <Typography sx={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>{a.text}</Typography>
                  <Typography sx={{ fontSize: 10, color: "text.secondary", whiteSpace: "nowrap" }}>{a.time}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}