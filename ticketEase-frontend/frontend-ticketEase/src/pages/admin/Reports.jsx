import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Tabs, Tab, Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";
import SimpleBar from "../../components/adminuis/SimpleBar";
import ColumnChart from "../../components/adminuis/ColumnChart";

export default function Reports() {
  const [tab, setTab] = useState(0);
  const monthData = [
    { label: "Jan", v: 55 }, { label: "Feb", v: 70, gold: true }, { label: "Mar", v: 48 }, { label: "Apr", v: 90, gold: true }, { label: "May", v: 62 },
  ];

  return (
    <Box>
      <GoldLine />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
        mb: 2, borderBottom: "1px solid rgba(26,58,92,0.12)",
        "& .MuiTab-root": { textTransform: "none", fontFamily: "'Georgia', serif", fontWeight: 600, fontSize: 12, color: "text.secondary", minHeight: 40, py: 1 },
        "& .Mui-selected": { color: "primary.main" },
        "& .MuiTabs-indicator": { bgcolor: "secondary.main" },
      }}>
        <Tab label="Overview" />
        <Tab label="By Department" />
        <Tab label="Trend" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <Grid container spacing={1.2} sx={{ mb: 2 }}>
            {[["248", "Total Tickets"], ["94%", "Resolution Rate"], ["1.4d", "Avg. Resolution Time"]].map(([num, lbl]) => (
              <Grid item xs={4} key={lbl}>
                <Box sx={{ bgcolor: "primary.main", borderRadius: 1, p: "14px", color: "#fff" }}>
                  <Typography variant="h4" sx={{ color: "secondary.light", fontWeight: 700, fontSize: 28 }}>{num}</Typography>
                  <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.07em", mt: 0.3 }}>{lbl}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
                <CardContent>
                  <CardTitle>Status Breakdown</CardTitle>
                  <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                    {[["87", "Open", "primary.main"], ["20", "Pending", "warning.main"], ["141", "Closed", "success.main"], ["20", "Urgent", "error.main"]].map(([v, l, c]) => (
                      <Box key={l} sx={{ textAlign: "center" }}>
                        <Typography variant="h5" sx={{ color: c, fontWeight: 700, fontSize: 22 }}>{v}</Typography>
                        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{l}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <SimpleBar label="Closed" pct={57} color="#2e7d32" />
                  <SimpleBar label="Open" pct={35} />
                  <SimpleBar label="Urgent" pct={8} color="#b91c1c" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
                <CardContent>
                  <CardTitle>Top Requestors</CardTitle>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Tickets</TableCell>
                        <TableCell>Resolved</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[["Cruz, Maria L.", 14, 12], ["Santos, Jun B.", 11, 9], ["Reyes, Ana P.", 8, 8], ["Lim, Carlo D.", 7, 5]].map(([name, t, r]) => (
                        <TableRow key={name} hover>
                          <TableCell>{name}</TableCell>
                          <TableCell>{t}</TableCell>
                          <TableCell><StatusChip status="Closed" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      {tab === 1 && (
        <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
          <CardContent>
            <CardTitle>Tickets by Department</CardTitle>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Department", "Assigned", "Open", "Resolved", "Avg. Time"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {[["Registrar", 132, 42, 90, "1.2 days"], ["IT Department", 67, 25, 42, "0.8 days"], ["Finance", 31, 15, 16, "2.1 days"], ["Academic Affairs", 18, 5, 13, "1.5 days"]].map(([dept, ...rest]) => (
                  <TableRow key={dept} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{dept}</TableCell>
                    {rest.map((v, i) => <TableCell key={i}>{v}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {tab === 2 && (
        <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
          <CardContent>
            <CardTitle>Monthly Ticket Trend — 2026</CardTitle>
            <ColumnChart data={monthData} maxH={90} />
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1 }}>
              Gold bars indicate months with peak ticket volume. April recorded the highest at 90 tickets.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}