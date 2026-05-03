import React from "react";
import { Box, Grid, Card, CardContent, Typography, TextField, Button, FormControl, Select, MenuItem, Paper, Stack, Avatar } from "@mui/material";
import GoldLine from "../../components/adminuis/GoldLine";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";


export default function RegisterUser() {
  const recentUsers = [
    { initials: "PA", name: "Pedro Aquino", meta: "IT Department · Staff · 1h ago", navyBg: true, status: "Active" },
    // ...other users
  ];

  return (
    <Box>
      <GoldLine />
      <Grid container spacing={2.5}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", mb: 1.5 }}>
            <CardContent>
              <CardTitle>New User Registration</CardTitle>
              <Grid container spacing={1.5}>
                {/* Inputs as per your original code */}
                {/* ... */}
              </Grid>
              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <Button variant="contained" color="primary" size="small">Register User</Button>
                <Button variant="outlined" size="small">Clear Form</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ borderLeft: "3px solid #c9993a", pl: 1.2, mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontSize: 12, color: "primary.main" }}>Recently Registered</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Last 5 accounts created</Typography>
          </Box>
          <Stack spacing={1}>
            {recentUsers.map((u, i) => (
              <Paper key={i} variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, p: "10px 12px", borderColor: "rgba(26,58,92,0.12)" }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: u.navyBg ? "primary.main" : "secondary.main", color: u.navyBg ? "#fff" : "primary.dark" }}>{u.initials}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{u.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{u.meta}</Typography>
                </Box>
                <StatusChip status={u.status} />
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}