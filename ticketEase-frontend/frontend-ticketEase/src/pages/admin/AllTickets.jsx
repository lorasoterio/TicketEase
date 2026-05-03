import React from "react";
import { Box, TextField, FormControl, Select, MenuItem, Button, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function Tickets() {
  const rows = [
    { id: "#T-2081", subject: "Transcript of Records", requestor: "Cruz, Maria L.", type: "Document", date: "May 1, 2026", status: "Urgent" },
    // ...other rows
  ];
  return (
    <Box>
      <GoldLine />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small" placeholder="Search tickets…"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} /></InputAdornment> }}
          sx={{ flex: 1, maxWidth: 260, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        {[["All Status", ["Open", "Pending", "Closed", "Urgent"]], ["All Departments", ["Registrar", "IT", "Finance"]]].map(([placeholder, opts], i) => (
          <FormControl key={i} size="small" sx={{ minWidth: 140 }}>
            <Select defaultValue="" displayEmpty sx={{ fontSize: 12 }}>
              <MenuItem value="" sx={{ fontSize: 12 }}>{placeholder}</MenuItem>
              {opts.map(o => <MenuItem key={o} value={o.toLowerCase()} sx={{ fontSize: 12 }}>{o}</MenuItem>)}
            </Select>
          </FormControl>
        ))}
        <Button variant="outlined" size="small" sx={{ fontSize: 11 }}>Filter</Button>
      </Box>
      <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", p: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Ticket ID", "Subject", "Requestor", "Type", "Date", "Status", "Action"].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ color: "text.secondary" }}>{r.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{r.subject}</TableCell>
                  <TableCell>{r.requestor}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><StatusChip status={r.status} /></TableCell>
                  <TableCell><Button size="small" variant="outlined" sx={{ fontSize: 10, py: 0.3, px: 1 }}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Showing 7 of 248 tickets</Typography>
        <Box sx={{ display: "flex", gap: 0.8 }}>
          <Button size="small" variant="outlined" sx={{ fontSize: 11 }}>← Prev</Button>
          <Button size="small" variant="contained" sx={{ fontSize: 11 }}>Next →</Button>
        </Box>
      </Box>
    </Box>
  );
}