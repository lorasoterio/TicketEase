import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Button, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack, Chip, InputLabel, Snackbar, IconButton, List, ListItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import GoldLine from "../../components/adminuis/Goldline";
import StatusChip from "../../components/adminuis/StatusChip";
import { AuthContext } from "../../context/AuthContext";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Send from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import useAllTickets from "../../hooks/admin/useAllTickets";
import useAdminTicketMessages from "../../hooks/admin/useAdminTicketMessages";
import useTicketAttachments from "../../hooks/admin/useTicketAttachments";

const STATUS_OPTIONS = ["Assigned", "In Progress", "Responded", "Ready for Pickup", "Rejected", "Closed"];

export default function Tickets() {
  const { user } = useContext(AuthContext);
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

  // Dynamically filter status options based on ticket type and estimated completion date
  const updateStatusOptions = useMemo(() => {
    if (!updateTicket) return [];
    const isDocReq = updateTicket.ticketType === "DocumentRequest" || updateTicket.ticketType === 0;
    const isInquiry = updateTicket.ticketType === "Inquiry" || updateTicket.ticketType === 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = dateOfPickup ? new Date(dateOfPickup) : null;
    if (pickupDate) pickupDate.setHours(0, 0, 0, 0);
    const pickupDateReached = pickupDate !== null && today >= pickupDate;
    return STATUS_OPTIONS.filter((s) => {
      if (s === "Responded") return isInquiry;
      if (s === "Ready for Pickup") return isDocReq && pickupDateReached;
      return true;
    });
  }, [updateTicket, dateOfPickup]);

  // ── View dialog: threaded messages (Inquiry tickets) ──
  const { messages, loading: msgLoading, sending, error: msgError, sendMessage } =
    useAdminTicketMessages(viewTicket?.ticketId ?? null);
  const { attachments: viewAttachments, loading: attachLoading } =
    useTicketAttachments(viewTicket?.ticketId ?? null);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!viewTicket) setDraft("");
  }, [viewTicket]);

  const handleSendMessage = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await sendMessage(text);
  };

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
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ fontSize: 10, py: 0.3, px: 1 }}
                          onClick={() => handleOpenUpdate(r._raw)}
                        >
                          Update Status
                        </Button>
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
                  {updateStatusOptions.map((o) => (
                    <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(updateTicket?.ticketType === "DocumentRequest" || updateTicket?.ticketType === 0) && (
                <TextField
                  label="Estimated Completion"
                  type="date"
                  size="small"
                  fullWidth
                  value={dateOfPickup}
                  onChange={(e) => setDateOfPickup(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="'Ready for Pickup' becomes available once this date is reached"
                  FormHelperTextProps={{ sx: { fontSize: 10 } }}
                  sx={{ "& .MuiInputBase-input": { fontSize: 12 } }}
                />
              )}
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
        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
          {viewTicket && (
            <>
              <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
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
                  <DetailRow label="Requestor" value={studentMap[viewTicket.studentId]?.fullName ?? "—"} />
                  <DetailRow label="School ID" value={studentMap[viewTicket.studentId]?.schoolStudentId ?? "—"} />
                  <DetailRow label="Year / Level" value={studentMap[viewTicket.studentId]?.yearLevel ?? "—"} />
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
              </Box>

              {/* ── Message thread (Inquiry tickets only) ── */}
              {viewTicket.ticketType === "Inquiry" && (
                <>
                  <Divider />
                  <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", letterSpacing: 0.5 }}>
                      MESSAGE THREAD
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      overflowY: "auto",
                      maxHeight: 260,
                      minHeight: 100,
                    }}
                  >
                    {msgLoading && (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                    {msgError && (
                      <Alert severity="error" sx={{ fontSize: 11, mb: 1 }}>{msgError}</Alert>
                    )}
                    {!msgLoading && messages.length === 0 && !msgError && (
                      <Typography sx={{ fontSize: 12, color: "text.secondary", textAlign: "center", mt: 2 }}>
                        No messages yet. Start the conversation below.
                      </Typography>
                    )}
                    {messages.map((m) => (
                      <AdminMessageBubble key={m.messageId} msg={m} currentUserId={user?.userId} />
                    ))}
                    <div ref={bottomRef} />
                  </Box>
                  <Divider />
                  <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: "flex-end" }}>
                    <TextField
                      multiline
                      maxRows={4}
                      size="small"
                      fullWidth
                      placeholder="Type a response…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sending}
                      sx={{ "& .MuiInputBase-input": { fontSize: 12 } }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={sending || !draft.trim()}
                      sx={{
                        bgcolor: "#1a3a5c",
                        color: "#fff",
                        "&:hover": { bgcolor: "#16324f" },
                        "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
                      }}
                    >
                      {sending ? (
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                      ) : (
                        <Send fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </>
              )}
            </>
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

function AdminMessageBubble({ msg, currentUserId }) {
  const isMine = msg.senderId === currentUserId;
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "";
  return (
    <Stack direction="column" alignItems={isMine ? "flex-end" : "flex-start"} sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.3, px: 0.5 }}>
        {isMine ? "You" : msg.senderName ?? "Unknown"} · {time}
      </Typography>
      <Box
        sx={{
          maxWidth: "75%",
          px: 1.5,
          py: 1,
          borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          bgcolor: isMine ? "#1a3a5c" : "#f0f4f8",
          color: isMine ? "#fff" : "text.primary",
        }}
      >
        <Typography sx={{ fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.message}
        </Typography>
      </Box>
    </Stack>
  );
}