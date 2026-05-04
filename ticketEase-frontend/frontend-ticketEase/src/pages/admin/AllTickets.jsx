import React, { useState } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Button, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack, Chip, InputLabel, Snackbar } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useAllTickets from "../../hooks/admin/useAllTickets";

const STATUS_OPTIONS = ["Assigned", "In Progress", "Responded", "Ready for Pickup", "Completed", "Rejected", "Closed"];
const UPDATE_STATUS_OPTIONS = STATUS_OPTIONS.filter((s) => s !== "Ready for Pickup");

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
    refetch,
    updateStatus,
  } = useAllTickets();

  const [viewTicket, setViewTicket] = useState(null);
  const [updateTicket, setUpdateTicket] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateOfPickup, setDateOfPickup] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  const handleOpenUpdate = (raw) => {
    setUpdateTicket(raw);
    setSelectedStatus(raw.status ?? "");
    setDateOfPickup(
      raw.estimatedCompletion
        ? new Date(raw.estimatedCompletion).toISOString().split("T")[0]
        : ""
    );
    setUpdateError(null);
  };

  const handleConfirmUpdate = async () => {
    if (!updateTicket || !selectedStatus) return;
    setUpdating(true);
    setUpdateError(null);
    const { error: err } = await updateStatus(updateTicket, selectedStatus, dateOfPickup || null);
    setUpdating(false);
    if (err) {
      setUpdateError(typeof err === "string" ? err : "Failed to update status.");
    } else {
      setUpdateTicket(null);
      setDateOfPickup("");
      setSnackbar("Status updated successfully.");
      refetch();
    }
  };

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
                      <Box sx={{ display: "flex", gap: 0.6 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 10, py: 0.3, px: 1 }}
                          onClick={() => setViewTicket(r._raw)}
                        >
                          View
                        </Button>
                        {r._raw.ticketType === "DocumentRequest" && (
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ fontSize: 10, py: 0.3, px: 1 }}
                            onClick={() => handleOpenUpdate(r._raw)}
                          >
                            Update Status
                          </Button>
                        )}
                      </Box>
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

      {/* ── Update Status Dialog (Document Request only) ── */}
      <Dialog open={!!updateTicket} onClose={() => { setUpdateTicket(null); setDateOfPickup(""); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Update Ticket Status</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {updateTicket && (
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Ticket</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{updateTicket.subject}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{updateTicket.referenceNumber ?? `#T-${updateTicket.ticketId}`}</Typography>
              </Box>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: 12 }}>New Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="New Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ fontSize: 12 }}
                >
                  {UPDATE_STATUS_OPTIONS.map((o) => (
                    <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Estimated Completion"
                type="date"
                size="small"
                fullWidth
                value={dateOfPickup}
                onChange={(e) => setDateOfPickup(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="When this date is reached, status will become Ready for Pickup"
                FormHelperTextProps={{ sx: { fontSize: 10 } }}
                sx={{ "& .MuiInputBase-input": { fontSize: 12 } }}
              />
              {updateError && <Alert severity="error" sx={{ fontSize: 12 }}>{updateError}</Alert>}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUpdateTicket(null); setDateOfPickup(""); }} size="small" sx={{ fontSize: 12 }} disabled={updating}>Cancel</Button>
          <Button
            onClick={handleConfirmUpdate}
            size="small"
            variant="contained"
            sx={{ fontSize: 12 }}
            disabled={updating || !selectedStatus}
          >
            {updating ? <CircularProgress size={14} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

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

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar("")}
        message={snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
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