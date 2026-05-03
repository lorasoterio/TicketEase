import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import GoldLine from "../../components/adminuis/GoldLine";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";
import SimpleBar from "../../components/adminuis/SimpleBar";
import ColumnChart from "../../components/adminuis/ColumnChart";

export default function Dashboard() {
  const stats = [
    { label: "Total Tickets", value: "248", sub: "↑ 14 this week", color: "primary.main" },
    { label: "Open", value: "87", sub: "Awaiting action", color: "primary.main" },
    { label: "Resolved", value: "141", sub: "↑ 8% vs last month", color: "success.main" },
    { label: "Urgent", value: "20", sub: "Needs attention", color: "error.main" },
  ];

  const recentTickets = [
    { id: "#T-2081", subject: "Transcript of Records Request", status: "Urgent" },
    { id: "#T-2080", subject: "Enrollment Verification Letter", status: "Open" },
    { id: "#T-2079", subject: "Certificate of Graduation", status: "Pending" },
    { id: "#T-2078", subject: "Good Moral Certificate", status: "Closed" },
    { id: "#T-2077", subject: "Diploma Authentication", status: "Open" },
  ];

  const weekData = [
    { label: "Mon", v: 40, dim: true }, { label: "Tue", v: 60 },
    { label: "Wed", v: 50, dim: true }, { label: "Thu", v: 75 },
    { label: "Fri", v: 65, dim: false }, { label: "Sat", v: 30, gold: true },
    { label: "Sun", v: 15, gold: true },
  ];

  const activity = [
    { color: "secondary.main", text: <span>Ticket #T-2081 marked <strong>Urgent</strong> by Admin</span>, time: "2m ago" },
    { color: "success.main", text: <span>Ticket #T-2075 resolved by <strong>Maria R.</strong></span>, time: "18m ago" },
    { color: "primary.main", text: <span>New user <strong>Pedro A.</strong> registered</span>, time: "1h ago" },
    { color: "secondary.main", text: <span>Ticket #T-2070 reassigned to Registrar</span>, time: "2h ago" },
    { color: "success.main", text: <span>Batch of 5 tickets closed automatically</span>, time: "3h ago" },
  ];

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
              <SimpleBar label="Transcript of Records" pct={42} />
              <SimpleBar label="Enrollment Verification" pct={28} />
              <SimpleBar label="Certificate Request" pct={18} color="secondary.main" />
              <SimpleBar label="Authentication" pct={8} color="secondary.main" />
              <SimpleBar label="Others" pct={4} color="text.secondary" />
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