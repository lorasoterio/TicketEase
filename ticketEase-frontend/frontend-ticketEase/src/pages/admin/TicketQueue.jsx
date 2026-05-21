import React, { useState } from "react";
import {
  Box, TextField, FormControl, Select, MenuItem, Paper, Typography,
  Button, Stack, InputAdornment, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Chip,
  List, ListItem, ListItemText, ListItemIcon, Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GoldLine from "../../components/adminuis/GoldLine";
import useTicketQueue, { timeAgo, priorityLabel } from "../../hooks/admin/useTicketQueue";
import useTicketAttachments from "../../hooks/admin/useTicketAttachments";
import { getAllStaff } from "../../services/userService";

export default function Queue() {
  const {
    tickets, loading, error,
    search, setSearch,
    priorityFilter, setPriorityFilter,
    typeFilter, setTypeFilter,
    refetch, assignTicketToStaff,
  } = useTicketQueue();

  // ── View dialog ──────────────────────────────────────────────
  const [viewTicket, setViewTicket] = useState(null);
  const { attachments: viewAttachments, loading: attachLoading } = useTicketAttachments(viewTicket?.ticketId ?? null);

  // ── Assign dialog ─────────────────────────────────────────────
  const [assignTarget, setAssignTarget] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const handleOpenAssign = async (ticket) => {
    setAssignTarget(ticket);
    setSelectedStaffId("");
    setAssignError(null);
    setStaffLoading(true);
    try {
      const data = await getAllStaff();
      setStaffList(data || []);
    } catch {
      setStaffList([]);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleCloseAssign = () => {
    if (assigning) return;
    setAssignTarget(null);
    setAssignError(null);
  };

  const handleConfirmAssign = async () => {
    if (!selectedStaffId || !assignTarget) return;
    setAssigning(true);
    setAssignError(null);
    const { success, error: err } = await assignTicketToStaff(assignTarget, Number(selectedStaffId));
    setAssigning(false);
    if (success) {
      setAssignTarget(null);
    } else {
      setAssignError(err);
    }
  };

  return (
    <Box>
      <GoldLine />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search queue…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 260, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            displayEmpty
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Priorities</MenuItem>
            <MenuItem value="urgent" sx={{ fontSize: 12 }}>Urgent</MenuItem>
            <MenuItem value="normal" sx={{ fontSize: 12 }}>Normal</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            displayEmpty
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Types</MenuItem>
            <MenuItem value="document" sx={{ fontSize: 12 }}>Document Request</MenuItem>
            <MenuItem value="inquiry" sx={{ fontSize: 12 }}>Inquiry</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={refetch} sx={{ mb: 1.5, fontSize: 12 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && tickets.length === 0 && (
        <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", py: 4 }}>
          No pending tickets in the queue.
        </Typography>
      )}

      {!loading && !error && (
        <Stack spacing={0.8}>
          {tickets.map((ticket, i) => {
            const label = priorityLabel(ticket.priority);
            return (
              <Paper
                key={ticket.ticketId}
                variant="outlined"
                sx={{
                  display: "flex", alignItems: "center", gap: 1.2, p: "10px 12px",
                  borderColor: "rgba(26,58,92,0.12)", cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" }, transition: "border-color 0.15s",
                }}
              >
                <Typography variant="h5" sx={{ color: "secondary.main", minWidth: 28, fontSize: 18 }}>
                  {i + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {ticket.subject || `${ticket.ticketType} Request`}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.2 }}>
                    #{ticket.referenceNumber} · Submitted {timeAgo(ticket.createdAt)} ·{" "}
                    <Box
                      component="strong"
                      sx={{ color: label === "Urgent" ? "error.main" : "inherit" }}
                    >
                      {label}
                    </Box>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.8 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: 11, py: 0.6, px: 1.2 }}
                    onClick={(e) => { e.stopPropagation(); handleOpenAssign(ticket); }}
                  >
                    Assign
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11, py: 0.6, px: 1.2 }}
                    onClick={(e) => { e.stopPropagation(); setViewTicket(ticket); }}
                  >
                    View
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* ── View Ticket Dialog ─────────────────────────────────── */}
      <Dialog open={!!viewTicket} onClose={() => setViewTicket(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>
          Ticket Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {viewTicket && (
            <Stack spacing={1.5}>
              <DetailRow label="Reference #" value={`#${viewTicket.referenceNumber}`} />
              <DetailRow label="Subject" value={viewTicket.subject || "—"} />
              <DetailRow label="Type" value={viewTicket.ticketType} />
              <DetailRow
                label="Priority"
                value={
                  <Chip
                    label={priorityLabel(viewTicket.priority)}
                    size="small"
                    color={viewTicket.priority === "High" ? "error" : "default"}
                    sx={{ fontSize: 11 }}
                  />
                }
              />
              <DetailRow label="Status" value={viewTicket.status} />
              <DetailRow label="Submitted" value={timeAgo(viewTicket.createdAt)} />
              {viewTicket.description && (
                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Description</Typography>
                  <Typography sx={{ fontSize: 12 }}>{viewTicket.description}</Typography>
                </Box>
              )}
              <Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Attachments</Typography>
                {attachLoading ? (
                  <CircularProgress size={16} />
                ) : viewAttachments.length === 0 ? (
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>No attachments.</Typography>
                ) : (
                  <List dense disablePadding>
                    {viewAttachments.map((a) => (
                      <ListItem key={a.attachmentId} disablePadding sx={{ gap: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <AttachFileIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={a.fileName}
                          primaryTypographyProps={{ fontSize: 12, noWrap: true, title: a.fileName }}
                          secondary={a.fileType}
                          secondaryTypographyProps={{ fontSize: 10 }}
                          sx={{ flex: 1, minWidth: 0 }}
                        />
                        <Tooltip title="Open in new tab">
                          <Button
                            size="small"
                            component="a"
                            href={a.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ minWidth: 0, p: 0.5 }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 15 }} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Download">
                          <Button
                            size="small"
                            component="a"
                            href={a.fileUrl}
                            download={a.fileName}
                            sx={{ minWidth: 0, p: 0.5 }}
                          >
                            <DownloadIcon sx={{ fontSize: 15 }} />
                          </Button>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTicket(null)} size="small" sx={{ fontSize: 12 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Assign Ticket Dialog ───────────────────────────────── */}
      <Dialog open={!!assignTarget} onClose={handleCloseAssign} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Assign Ticket</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {assignTarget && (
            <Stack spacing={1.5}>
              <Typography sx={{ fontSize: 12 }}>
                Assigning <strong>{assignTarget.subject || `#${assignTarget.referenceNumber}`}</strong> to a staff member.
              </Typography>
              {staffLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={22} />
                </Box>
              ) : (
                <FormControl size="small" fullWidth>
                  <Select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    displayEmpty
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: 12 }}>Select staff member…</MenuItem>
                    {staffList.map((s) => (
                      <MenuItem key={s.userId ?? s.staffId} value={s.userId ?? s.staffId} sx={{ fontSize: 12 }}>
                        {s.fullName ?? s.user?.fullName ?? `Staff #${s.staffId}`}
                        {s.department ? ` — ${s.department}` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {assignError && (
                <Alert severity="error" sx={{ fontSize: 12 }}>{assignError}</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssign} size="small" sx={{ fontSize: 12 }} disabled={assigning}>Cancel</Button>
          <Button
            onClick={handleConfirmAssign}
            size="small"
            variant="contained"
            sx={{ fontSize: 12 }}
            disabled={!selectedStaffId || assigning}
          >
            {assigning ? "Assigning…" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Typography sx={{ fontSize: 11, color: "text.secondary", minWidth: 100 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 500 }} component="div">{value}</Typography>
    </Box>
  );
}