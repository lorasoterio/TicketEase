import React, { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GoldLine from "../../components/adminuis/Goldline";
import useTicketQueue, { timeAgo, priorityLabel, fetchAllGradeLevels, fetchAllStaffs } from "../../hooks/admin/useTicketQueue";
import useTicketAttachments from "../../hooks/admin/useTicketAttachments";
import { assignGradeRepresentative, getAllAssignments } from "../../services/assignRepresentativeService";

function formatTimestamp(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function AssignGradeRepDialog({ open, onClose, onAssign, error }) {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedGradeLevelId, setSelectedGradeLevelId] = useState("");
  const [gradeLevels, setGradeLevels] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [swapPrompt, setSwapPrompt] = useState(null);

  const resolveStaffLabel = (staffId) => {
    const staff = staffList.find((entry) => Number(entry.staffId) === Number(staffId));
    return staff?.fullName ?? staff?.user?.fullName ?? `Staff #${staffId}`;
  };

  const resolveGradeLabel = (gradeLevelId) => {
    if (gradeLevelId === "graduate") return "Graduate";
    const gradeLevel = gradeLevels.find((entry) => Number(entry.gradeLevelId) === Number(gradeLevelId));
    return gradeLevel?.name ?? gradeLevel?.gradeLevelName ?? `Grade #${gradeLevelId}`;
  };

  const getExistingAssignment = () => {
    if (!selectedGradeLevelId) return null;

    return (
      assignments.find((assignment) => {
        if (selectedGradeLevelId === "graduate") {
          return Boolean(assignment?.isGraduate);
        }

        const assignmentGradeLevelId = assignment?.gradeLevelId ?? assignment?.gradeLevels?.gradeLevelId;
        return !assignment?.isGraduate && String(assignmentGradeLevelId) === String(selectedGradeLevelId);
      }) || null
    );
  };

  const submitAssignment = async () => {
    setAssigning(true);
    setAssignError(null);
    try {
      await onAssign(selectedStaffId, selectedGradeLevelId);
      setSelectedStaffId("");
      setSelectedGradeLevelId("");
      onClose();
    } catch (e) {
      setAssignError(e?.message || "Assignment failed.");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssign = async () => {
    if (assigning) return;

    const existingAssignment = getExistingAssignment();
    const existingStaffId =
      existingAssignment?.staffId ??
      existingAssignment?.staff?.staffId ??
      existingAssignment?.staff?.id ??
      null;

    if (existingAssignment && String(existingStaffId) !== String(selectedStaffId)) {
      setSwapPrompt({
        currentStaffName:
          existingAssignment.staff?.fullName ??
          existingAssignment.staff?.user?.fullName ??
          resolveStaffLabel(existingAssignment.staffId),
        newStaffName: resolveStaffLabel(selectedStaffId),
        gradeLabel: resolveGradeLabel(selectedGradeLevelId),
      });
      return;
    }

    await submitAssignment();
  };

  const handleConfirmSwap = async () => {
    setSwapPrompt(null);
    await submitAssignment();
  };

  useEffect(() => {
    if (!open) return;

    setSelectedStaffId("");
    setSelectedGradeLevelId("");
    setAssignError(null);
    setSwapPrompt(null);
    setGradeLoading(true);
    setStaffLoading(true);
    setAssignmentLoading(true);

    Promise.all([fetchAllGradeLevels(), fetchAllStaffs(), getAllAssignments()])
      .then(([gradeLevelResult, staffResult, assignmentResult]) => {
        setGradeLevels(gradeLevelResult.gradeLevels || []);
        setStaffList(staffResult.staff || []);
        setAssignments(Array.isArray(assignmentResult) ? assignmentResult : []);
      })
      .catch(() => {
        setGradeLevels([]);
        setStaffList([]);
        setAssignments([]);
      })
      .finally(() => {
        setGradeLoading(false);
        setStaffLoading(false);
        setAssignmentLoading(false);
      });
  }, [open]);

  const currentAssignment = getExistingAssignment();
  const currentAssignmentStaffName = currentAssignment
    ? currentAssignment.staff?.fullName ??
      currentAssignment.staff?.user?.fullName ??
      resolveStaffLabel(currentAssignment.staffId)
    : null;
  const assignmentRecords = assignments.map((assignment) => {
    const gradeId = assignment?.isGraduate
      ? "graduate"
      : assignment?.gradeLevelId ?? assignment?.gradeLevels?.gradeLevelId;
    const staffId = assignment?.staffId ?? assignment?.staff?.staffId ?? assignment?.staff?.id;
    const staffName = assignment?.staff?.fullName ?? assignment?.staff?.user?.fullName ?? resolveStaffLabel(staffId);

    return {
      key: `${gradeId}-${staffId}`,
      gradeLabel: resolveGradeLabel(gradeId),
      staffName,
    };
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Assign Grade Representative</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={1.5}>
            <Typography sx={{ fontSize: 12 }}>Select a staff member and grade level to assign as representative.</Typography>
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.2, bgcolor: "grey.50" }}>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.5 }}>Current assignments</Typography>
              {assignmentLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                  <CircularProgress size={16} />
                </Box>
              ) : assignmentRecords.length === 0 ? (
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>No grade representatives assigned yet.</Typography>
              ) : (
                <Stack spacing={0.4}>
                  {assignmentRecords.map((record) => (
                    <Typography key={record.key} sx={{ fontSize: 12 }}>
                      {record.gradeLabel}: {record.staffName}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Box>
            {staffLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={22} />
              </Box>
            ) : (
              <Autocomplete
                options={staffList}
                getOptionLabel={(s) => s.fullName ?? s.user?.fullName ?? `Staff #${s.staffId}`}
                renderOption={(props, s) => (
                  <li {...props} key={s.staffId}>
                    {s.fullName ?? s.user?.fullName ?? `Staff #${s.staffId}`}
                  </li>
                )}
                value={staffList.find((s) => String(s.staffId) === String(selectedStaffId)) || null}
                onChange={(_, value) => setSelectedStaffId(value ? value.staffId : "")}
                isOptionEqualToValue={(option, value) => Number(option.staffId) === Number(value.staffId)}
                renderInput={(params) => <TextField {...params} label="Select staff member…" size="small" sx={{ mb: 2 }} />}
                fullWidth
                disableClearable
              />
            )}
            {gradeLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={18} />
              </Box>
            ) : (
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedGradeLevelId}
                  onChange={(e) => setSelectedGradeLevelId(e.target.value)}
                  displayEmpty
                  sx={{ fontSize: 12 }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: 12 }}>Select grade level…</MenuItem>
                  {gradeLevels.map((g) => (
                    <MenuItem key={g.gradeLevelId} value={g.gradeLevelId} sx={{ fontSize: 12 }}>
                      {g.name ?? g.gradeLevelName ?? `Grade #${g.gradeLevelId}`}
                    </MenuItem>
                  ))}
                  <MenuItem value="graduate" sx={{ fontSize: 12, fontStyle: "italic", color: "success.main" }}>
                    Graduate
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {selectedGradeLevelId && !assignmentLoading && (
              <Alert severity={currentAssignment ? "info" : "success"} sx={{ fontSize: 12 }}>
                {currentAssignment
                  ? `Current representative for ${resolveGradeLabel(selectedGradeLevelId)}: ${currentAssignmentStaffName}`
                  : `No representative assigned for ${resolveGradeLabel(selectedGradeLevelId)} yet.`}
              </Alert>
            )}
            {error && <Alert severity="error" sx={{ fontSize: 12 }}>{error}</Alert>}
            {assignError && <Alert severity="error" sx={{ fontSize: 12 }}>{assignError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} size="small" sx={{ fontSize: 12 }} disabled={assigning}>Cancel</Button>
          <Button
            onClick={handleAssign}
            size="small"
            variant="contained"
            sx={{ fontSize: 12 }}
            disabled={!selectedStaffId || !selectedGradeLevelId || assigning || assignmentLoading}
          >
            {assigning ? "Assigning…" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(swapPrompt)} onClose={() => setSwapPrompt(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Replace Existing Assignment?</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ fontSize: 12 }}>
            {swapPrompt
              ? `Grade ${swapPrompt.gradeLabel} is currently assigned to ${swapPrompt.currentStaffName}. Assign to ${swapPrompt.newStaffName} instead?`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwapPrompt(null)} size="small" sx={{ fontSize: 12 }} disabled={assigning}>Cancel</Button>
          <Button onClick={handleConfirmSwap} size="small" variant="contained" sx={{ fontSize: 12 }} disabled={assigning}>
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AssignTicketDialog({ open, ticket, onClose, onAssign }) {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  useEffect(() => {
    if (!open) return;

    setSelectedStaffId("");
    setAssignError(null);
    setLoadingStaff(true);

    fetchAllStaffs()
      .then((result) => {
        setStaffList(result?.staff || []);
      })
      .catch(() => {
        setStaffList([]);
      })
      .finally(() => {
        setLoadingStaff(false);
      });
  }, [open]);

  const handleAssign = async () => {
    if (!ticket || !selectedStaffId || assigning) return;

    setAssigning(true);
    setAssignError(null);
    try {
      await onAssign(ticket, Number(selectedStaffId));
      onClose();
    } catch (err) {
      setAssignError(err?.message || "Failed to assign ticket.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Assign Ticket to Staff</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={1.5}>
          {ticket && (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.2, bgcolor: "grey.50" }}>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Ticket</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{ticket.subject || `${ticket.ticketType} Request`}</Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>#{ticket.referenceNumber}</Typography>
            </Box>
          )}

          {loadingStaff ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Autocomplete
              options={staffList}
              getOptionLabel={(s) => s.fullName ?? s.user?.fullName ?? `Staff #${s.staffId}`}
              renderOption={(props, s) => (
                <li {...props} key={s.staffId}>
                  {s.fullName ?? s.user?.fullName ?? `Staff #${s.staffId}`}
                </li>
              )}
              value={staffList.find((s) => String(s.staffId) === String(selectedStaffId)) || null}
              onChange={(_, value) => setSelectedStaffId(value ? value.staffId : "")}
              isOptionEqualToValue={(option, value) => Number(option.staffId) === Number(value.staffId)}
              renderInput={(params) => <TextField {...params} label="Select staff member..." size="small" />}
              fullWidth
              disableClearable
            />
          )}

          {assignError && <Alert severity="error" sx={{ fontSize: 12 }}>{assignError}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small" sx={{ fontSize: 12 }} disabled={assigning}>Cancel</Button>
        <Button
          onClick={handleAssign}
          size="small"
          variant="contained"
          sx={{ fontSize: 12 }}
          disabled={!selectedStaffId || assigning || loadingStaff}
        >
          {assigning ? "Assigning..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function UpdatePriorityDialog({ open, ticket, onClose, onUpdate }) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setUpdateError(null);
    setUpdating(false);
  }, [open, ticket?.ticketId]);

  const handleUpdate = async () => {
    if (!ticket || updating || ticket.priority === "High") return;

    setUpdating(true);
    setUpdateError(null);
    try {
      await onUpdate(ticket);
      onClose();
    } catch (err) {
      setUpdateError(err?.message || "Failed to update priority.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Update Ticket Priority</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={1.5}>
          {ticket && (
            <>
              <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.2, bgcolor: "grey.50" }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.4 }}>Ticket</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{ticket.subject || `${ticket.ticketType} Request`}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>#{ticket.referenceNumber}</Typography>
              </Box>

              <Alert severity={ticket.priority === "High" ? "success" : "info"} sx={{ fontSize: 12 }}>
                Current priority: {priorityLabel(ticket.priority)}
              </Alert>

              {ticket.priority !== "High" && (
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  This will mark the ticket as Urgent.
                </Typography>
              )}
            </>
          )}

          {updateError && <Alert severity="error" sx={{ fontSize: 12 }}>{updateError}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small" sx={{ fontSize: 12 }} disabled={updating}>Cancel</Button>
        <Button
          onClick={handleUpdate}
          size="small"
          variant="contained"
          sx={{ fontSize: 12 }}
          disabled={!ticket || updating || ticket?.priority === "High"}
        >
          {ticket?.priority === "High" ? "Already Urgent" : updating ? "Updating..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Queue() {
  const {
    tickets,
    studentMap,
    loading,
    error,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    refetch,
    assignTicketToStaff,
    markTicketAsHigh,
  } = useTicketQueue();

  const [viewTicket, setViewTicket] = useState(null);
  const { attachments: viewAttachments, loading: attachLoading } = useTicketAttachments(viewTicket?.ticketId ?? null);
  const [gradeRepModalOpen, setGradeRepModalOpen] = useState(false);
  const [gradeRepError, setGradeRepError] = useState(null);
  const [assignTicket, setAssignTicket] = useState(null);
  const [priorityTicket, setPriorityTicket] = useState(null);

  return (
    <Box>
      <GoldLine />
      <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
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
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} displayEmpty sx={{ fontSize: 12 }}>
              <MenuItem value="" sx={{ fontSize: 12 }}>All Priorities</MenuItem>
              <MenuItem value="urgent" sx={{ fontSize: 12 }}>Urgent</MenuItem>
              <MenuItem value="normal" sx={{ fontSize: 12 }}>Normal</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} displayEmpty sx={{ fontSize: 12 }}>
              <MenuItem value="" sx={{ fontSize: 12 }}>All Types</MenuItem>
              <MenuItem value="document" sx={{ fontSize: 12 }}>Document Request</MenuItem>
              <MenuItem value="inquiry" sx={{ fontSize: 12 }}>Inquiry</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" size="small" sx={{ ml: 2, fontSize: 12, minWidth: 130, alignSelf: "flex-start" }} onClick={() => { setGradeRepError(null); setGradeRepModalOpen(true); }}>
          Assign Grade Rep
        </Button>
        <AssignGradeRepDialog
          open={gradeRepModalOpen}
          onClose={() => setGradeRepModalOpen(false)}
          error={gradeRepError}
          onAssign={async (staffId, gradeLevelId) => {
            await assignGradeRepresentative({ staffId: Number(staffId), gradeLevelId });
          }}
        />
        <AssignTicketDialog
          open={Boolean(assignTicket)}
          ticket={assignTicket}
          onClose={() => setAssignTicket(null)}
          onAssign={async (ticket, staffId) => {
            const result = await assignTicketToStaff(ticket, staffId);
            if (!result.success) {
              throw new Error(result.error || "Failed to assign ticket.");
            }
          }}
        />
        <UpdatePriorityDialog
          open={Boolean(priorityTicket)}
          ticket={priorityTicket}
          onClose={() => setPriorityTicket(null)}
          onUpdate={async (ticket) => {
            const result = await markTicketAsHigh(ticket);
            if (!result.success) {
              throw new Error(result.error || "Failed to update priority.");
            }
          }}
        />
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
          No tickets found.
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  p: "10px 12px",
                  borderColor: "rgba(26,58,92,0.12)",
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                  transition: "border-color 0.15s",
                }}
              >
                <Typography variant="h5" sx={{ color: "secondary.main", minWidth: 28, fontSize: 18 }}>
                  {i + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{ticket.subject || `${ticket.ticketType} Request`}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.2 }}>
                    #{ticket.referenceNumber} · Submitted {timeAgo(ticket.createdAt)} ({formatTimestamp(ticket.createdAt)}) · <Box component="strong" sx={{ color: label === "Urgent" ? "error.main" : "inherit" }}>{label}</Box>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.8 }}>
                  <Button size="small" variant="contained" color="primary" sx={{ fontSize: 11, py: 0.6, px: 1.2 }} onClick={() => setAssignTicket(ticket)}>
                    Assign
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{ fontSize: 11, py: 0.6, px: 1.2 }}
                    onClick={() => setPriorityTicket(ticket)}
                  >
                    Update Priority
                  </Button>
                  <Button size="small" variant="outlined" sx={{ fontSize: 11, py: 0.6, px: 1.2 }} onClick={() => setViewTicket(ticket)}>
                    View
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      <Dialog open={!!viewTicket} onClose={() => setViewTicket(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Ticket Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {viewTicket && (
            <Stack spacing={1.5}>
              <DetailRow label="Reference #" value={`#${viewTicket.referenceNumber}`} />
              <DetailRow label="Subject" value={viewTicket.subject || "—"} />
              <DetailRow label="Type" value={viewTicket.ticketType} />
              <DetailRow label="Requestor" value={studentMap[viewTicket.studentId]?.fullName ?? "—"} />
              <DetailRow label="School ID" value={studentMap[viewTicket.studentId]?.schoolStudentId ?? "—"} />
              <DetailRow label="Year / Level" value={studentMap[viewTicket.studentId]?.yearLevel ?? "—"} />
              <DetailRow label="Priority" value={<Chip label={priorityLabel(viewTicket.priority)} size="small" color={viewTicket.priority === "High" ? "error" : "default"} sx={{ fontSize: 11 }} />} />
              <DetailRow label="Status" value={viewTicket.status} />
              <DetailRow label="Submitted" value={`${timeAgo(viewTicket.createdAt)} (${formatTimestamp(viewTicket.createdAt)})`} />
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
                          <Button size="small" component="a" href={a.fileUrl} target="_blank" rel="noopener noreferrer" sx={{ minWidth: 0, p: 0.5 }}>
                            <OpenInNewIcon sx={{ fontSize: 15 }} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Download">
                          <Button size="small" component="a" href={a.fileUrl} download={a.fileName} sx={{ minWidth: 0, p: 0.5 }}>
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