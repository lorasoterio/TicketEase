// PAGE: Register User
// ═══════════════════════════════════════════════════════════════════════════════
function PageRegister() {
  const recentUsers = [
    { initials: "PA", name: "Pedro Aquino",  meta: "IT Department · Staff · 1h ago",    navyBg: true,  status: "Active" },
    { initials: "LO", name: "Lea Ocampo",    meta: "Registrar · Staff · Yesterday",      navyBg: false, status: "Active" },
    { initials: "BG", name: "Ben Garcia",    meta: "Finance · Admin · 2 days ago",       navyBg: true,  status: "Active" },
    { initials: "AR", name: "Ana Reyes",     meta: "Academic Affairs · Faculty · 3d ago",navyBg: false, status: "Inactive" },
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
                {[["First Name","text","e.g. Maria"],["Last Name","text","e.g. Cruz"],["Email Address","email","user@school.edu.ph"],["Employee / Student ID","text","e.g. 2021-00123"]].map(([lbl,type,ph]) => (
                  <Grid item xs={6} key={lbl}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>{lbl}</Typography>
                    <TextField size="small" type={type} placeholder={ph} fullWidth inputProps={{ style: { fontSize: 13 } }} />
                  </Grid>
                ))}
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Department</Typography>
                  <FormControl size="small" fullWidth>
                    <Select defaultValue="" displayEmpty sx={{ fontSize: 13 }}>
                      <MenuItem value="" sx={{ fontSize: 13 }}>Select department</MenuItem>
                      {["Registrar","IT Department","Finance","Academic Affairs"].map(d => <MenuItem key={d} value={d} sx={{ fontSize: 13 }}>{d}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Role</Typography>
                  <FormControl size="small" fullWidth>
                    <Select defaultValue="Staff" sx={{ fontSize: 13 }}>
                      {["Staff","Admin","Student","Faculty"].map(r => <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Password</Typography>
                  <TextField size="small" type="password" placeholder="Temporary password" fullWidth inputProps={{ style: { fontSize: 13 } }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.6 }}>Confirm Password</Typography>
                  <TextField size="small" type="password" placeholder="Repeat password" fullWidth inputProps={{ style: { fontSize: 13 } }} />
                </Grid>
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