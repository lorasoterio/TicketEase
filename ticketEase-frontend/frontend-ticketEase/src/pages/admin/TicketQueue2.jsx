// PAGE: Ticket Queue
// ═══════════════════════════════════════════════════════════════════════════════
function PageQueue() {
  const items = [
    { num: 1, subject: "Transcript of Records — Cruz, Maria L.",    id: "#T-2081", time: "3h ago", priority: "Urgent" },
    { num: 2, subject: "Enrollment Verification — Santos, Jun B.",  id: "#T-2080", time: "5h ago", priority: "Normal" },
    { num: 3, subject: "Certificate of Graduation — Reyes, Ana P.", id: "#T-2079", time: "6h ago", priority: "Normal" },
    { num: 4, subject: "Good Moral Certificate — Lim, Carlo D.",    id: "#T-2078", time: "8h ago", priority: "Normal" },
    { num: 5, subject: "Diploma Authentication — Dela Cruz, Jose",  id: "#T-2077", time: "9h ago", priority: "Normal" },
    { num: 6, subject: "Transfer Credentials — Ocampo, Lea V.",     id: "#T-2076", time: "10h ago",priority: "Normal" },
  ];
 
  return (
    <Box>
      <GoldLine />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small" placeholder="Search queue…"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} /></InputAdornment> }}
          sx={{ flex: 1, maxWidth: 260, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select defaultValue="" displayEmpty sx={{ fontSize: 12 }}>
            <MenuItem value="" sx={{ fontSize: 12 }}>All Priorities</MenuItem>
            <MenuItem value="urgent" sx={{ fontSize: 12 }}>Urgent</MenuItem>
            <MenuItem value="normal" sx={{ fontSize: 12 }}>Normal</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select defaultValue="" displayEmpty sx={{ fontSize: 12 }}>
            <MenuItem value="" sx={{ fontSize: 12 }}>All Types</MenuItem>
            <MenuItem value="transcript" sx={{ fontSize: 12 }}>Transcript</MenuItem>
            <MenuItem value="certificate" sx={{ fontSize: 12 }}>Certificate</MenuItem>
          </Select>
        </FormControl>
      </Box>
 
      <Stack spacing={0.8}>
        {items.map((item, i) => (
          <Paper key={i} variant="outlined" sx={{
            display: "flex", alignItems: "center", gap: 1.2, p: "10px 12px",
            borderColor: "rgba(26,58,92,0.12)", cursor: "pointer",
            "&:hover": { borderColor: "primary.main" }, transition: "border-color 0.15s",
          }}>
            <Typography variant="h5" sx={{ color: "secondary.main", minWidth: 28, fontSize: 18 }}>{item.num}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.subject}</Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.2 }}>
                {item.id} · Submitted {item.time} ·{" "}
                <Box component="strong" sx={{ color: item.priority === "Urgent" ? "error.main" : "inherit" }}>{item.priority}</Box>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.8 }}>
              <Button size="small" variant="contained" color="primary" sx={{ fontSize: 11, py: 0.6, px: 1.2 }}>Assign</Button>
              <Button size="small" variant="outlined" sx={{ fontSize: 11, py: 0.6, px: 1.2 }}>View</Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}