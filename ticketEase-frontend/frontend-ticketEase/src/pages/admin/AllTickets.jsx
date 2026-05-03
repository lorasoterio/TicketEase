import React, { useState } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Button, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack, Chip } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useAllTickets from "../../hooks/admin/useAllTickets";

const STATUS_OPTIONS = ["Assigned", "In Progress", "Responded", "Ready for Pickup", "Completed", "Rejected", "Closed"];

export default function Tickets() {
  const {
    rows,
    studentMap,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    total,
  } = useAllTickets();

  const [viewTicket, setViewTicket] = useState(null);

  return (
    <Box>
      <GoldLine />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search tickets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} /></InputAdornment> }}
          sx={{ flex: 1, maxWidth: 260, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Status</MenuItem>
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>{o}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", p: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Ticket ID", "Subject", "Requestor", "Type", "Date", "Status", "Action"].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, fontSize: 12, color: "text.secondary" }}>
                    No assigned tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ color: "text.secondary" }}>{r.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.subject}</TableCell>
                    <TableCell>{r.requestor}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell><StatusChip status={r.status} /></TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 10, py: 0.3, px: 1 }}
                        onClick={() => setViewTicket(r._raw)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Showing {rows.length} of {total} tickets
        </Typography>
        <Box sx={{ display: "flex", gap: 0.8 }}>
          <Button
            size="small"
            variant="outlined"
            sx={{ fontSize: 11 }}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ fontSize: 11 }}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </Box>
      </Box>

      {/* ── View Ticket Dialog ───────────────────────── */}
      <Dialog open={!!viewTicket} onClose={() => setViewTicket(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Ticket Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {viewTicket && (
            <Stack spacing={1.5}>
              <DetailRow label="Reference #" value={viewTicket.referenceNumber ?? `#T-${viewTicket.ticketId}`} />
              <DetailRow label="Subject" value={viewTicket.subject || "—"} />
              <DetailRow label="Type" value={viewTicket.ticketType === "DocumentRequest" ? "Document Request" : (viewTicket.ticketType ?? "—")} />
              <DetailRow
                label="Priority"
                value={
                  <Chip
                    label={viewTicket.priority === "High" ? "Urgent" : (viewTicket.priority ?? "Normal")}
                    size="small"
                    color={viewTicket.priority === "High" ? "error" : "default"}
                    sx={{ fontSize: 11 }}
                  />
                }
              />
              <DetailRow label="Status" value={<StatusChip status={viewTicket.status} />} />
              <DetailRow label="Requestor" value={studentMap[viewTicket.studentId] ?? "—"} />
              <DetailRow
                label="Date Submitted"
                value={new Date(viewTicket.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              {viewTicket.estimatedCompletion && (
                <DetailRow
                  label="Est. Completion"
                  value={new Date(viewTicket.estimatedCompletion).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                />
              )}
              {viewTicket.description && (
                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Description</Typography>
                  <Typography sx={{ fontSize: 12 }}>{viewTicket.description}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTicket(null)} size="small" sx={{ fontSize: 12 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Typography sx={{ fontSize: 11, color: "text.secondary", minWidth: 110 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 500 }} component="div">{value}</Typography>
    </Box>
  );
}