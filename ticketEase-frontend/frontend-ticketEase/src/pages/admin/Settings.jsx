import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Switch, Button, TextField, Avatar } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";

export default function Settings() {
  const [toggles, setToggles] = useState({ email: true, autoAssign: false, sla: true, archive: true });
  const toggle = (key) => setToggles((p) => ({ ...p, [key]: !p[key] }));

  const settingRows = [
    { key: "email", name: "Email Notifications", desc: "Send email alerts on new tickets" },
    { key: "autoAssign", name: "Auto-assign Tickets", desc: "Distribute tickets to available staff" },
    { key: "sla", name: "SLA Reminders", desc: "Alert when tickets exceed SLA limit" },
    { key: "archive", name: "Ticket Archiving", desc: "Archive closed tickets after 90 days" },
  ];

  return (
    <Box>
      <GoldLine />
      <Grid container spacing={2.5}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", mb: 1.5 }}>
            <CardContent>
              <CardTitle>General Settings</CardTitle>
              {settingRows.map((s, i) => (
                <Box key={s.key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, borderBottom: i < settingRows.length - 1 ? "1px solid rgba(26,58,92,0.08)" : "none" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{s.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.3 }}>{s.desc}</Typography>
                  </Box>
                  <Switch
                    checked={toggles[s.key]}
                    onChange={() => toggle(s.key)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "primary.main" },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
          {/* ...Other Cards (Office Hours, etc.) */}
        </Grid>
        <Grid item xs={6}>
          {/* Admin Profile, System Info cards */}
        </Grid>
      </Grid>
    </Box>
  );
}