// PAGE: Settings
// ═══════════════════════════════════════════════════════════════════════════════
function PageSettings() {
  const [toggles, setToggles] = useState({ email: true, autoAssign: false, sla: true, archive: true });
 
  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));
 
  const settingRows = [
    { key: "email",      name: "Email Notifications",  desc: "Send email alerts on new tickets" },
    { key: "autoAssign", name: "Auto-assign Tickets",  desc: "Distribute tickets to available staff" },
    { key: "sla",        name: "SLA Reminders",        desc: "Alert when tickets exceed SLA limit" },
    { key: "archive",    name: "Ticket Archiving",     desc: "Archive closed tickets after 90 days" },
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
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle>Office Hours</CardTitle>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Opens At</Typography>
                  <TextField size="small" defaultValue="8:00 AM" fullWidth inputProps={{ style: { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Closes At</Typography>
                  <TextField size="small" defaultValue="5:00 PM" fullWidth inputProps={{ style: { fontSize: 13 } }} />
                </Grid>
              </Grid>
              <Button variant="contained" size="small" sx={{ mt: 1.5, fontSize: 12 }}>Save Hours</Button>
            </CardContent>
          </Card>
        </Grid>
 
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", mb: 1.5 }}>
            <CardContent>
              <CardTitle>Admin Profile</CardTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Avatar sx={{ width: 44, height: 44, fontSize: 15, fontWeight: 700, bgcolor: "secondary.main", color: "primary.dark" }}>JS</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>Juan Santos</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>IT Department · Administrator</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Display Name</Typography>
              <TextField size="small" defaultValue="Juan Santos" fullWidth inputProps={{ style: { fontSize: 13 } }} sx={{ mb: 1 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Email</Typography>
              <TextField size="small" type="email" defaultValue="j.santos@school.edu.ph" fullWidth inputProps={{ style: { fontSize: 13 } }} sx={{ mb: 1.2 }} />
              <Button variant="outlined" size="small" sx={{ fontSize: 12 }}>Update Profile</Button>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)" }}>
            <CardContent>
              <CardTitle>System Info</CardTitle>
              {[["Version","Ticket Ease v2.4.1"],["Last Backup","Apr 30, 2026 11:59 PM"],["Database", null]].map(([label, value], i) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.8, borderBottom: i < 2 ? "1px solid rgba(26,58,92,0.08)" : "none" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{label}</Typography>
                  {value ? <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{value}</Typography> : <StatusChip status="Healthy" />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}