// TicketRequestForm.jsx
// Just the form — no page wrapper, no ThemeProvider.
// Drop this inside any page that needs a "request ticket" form.

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Chip,
  Stack,
  Alert,
  Collapse,
  InputAdornment,
} from "@mui/material";
import {
  School,
  Description,
  Badge,
  Send,
  CheckCircle,
} from "@mui/icons-material";

import { useTicketForm } from "../../hooks/useTicketForm";
import {
  validateDocumentRequest,
  TICKET_TYPES,
} from "../../utils/ticketHelpers";

const INITIAL_FIELDS = {
  studentId: "",
  fullName: "",
  ticketType: "",
  subject: "",
  description: "",
};

// ─────────────────────────────────────────────────────────────
export default function TicketRequestForm({ onSuccess, onSubmitted }) {
  const {
    form,
    errors,
    submitted,
    ticketNumber,
    loading,
    studentProfile,
    handleChange,
    handleSubmit,
    handleReset,
  } = useTicketForm(INITIAL_FIELDS, validateDocumentRequest, onSuccess);

  const handleReset_ = () => {
    handleReset();
    onSubmitted?.();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderTop: "4px solid",
        borderTopColor: "secondary.main",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* ── Success State ── */}
      <Collapse in={submitted}>
        <Alert
          icon={<CheckCircle />}
          severity="success"
          sx={{ mb: 2 }}
          action={
            <Button size="small" onClick={handleReset_}>
              New Request
            </Button>
          }
        >
          <strong>Request submitted!</strong> Your ticket number is{" "}
          <Chip label={ticketNumber} size="small" color="success" sx={{ fontWeight: 700 }} />.
          Please keep this for follow-up.
        </Alert>
      </Collapse>

      {/* ── Form ── */}
      <Collapse in={!submitted}>
        <Stack spacing={2.5}>
          {errors.submit && (
            <Alert severity="error">{errors.submit}</Alert>
          )}

          {/* Student Information */}
          <SectionLabel
            icon={<Badge sx={{ color: "secondary.main", fontSize: 18 }} />}
            label="Student Information"
          />
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Student ID"
              value={form.studentId}
              onChange={handleChange("studentId")}
              error={!!errors.studentId}
              helperText={errors.studentId}
              placeholder="e.g. 2021-00123"
              InputProps={{
                readOnly: !!studentProfile,
                startAdornment: (
                  <InputAdornment position="start">
                    <School sx={{ color: "text.disabled", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              label="Full Name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName}
              placeholder="e.g. Juan dela Cruz"
              InputProps={{
                readOnly: !!studentProfile,
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={{ color: "text.disabled", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Divider />

          {/* Details of the Request */}
          <SectionLabel
            icon={<Description sx={{ color: "secondary.main", fontSize: 18 }} />}
            label="Details of the Request"
          />
          <Stack spacing={2}>
            <FormControl size="small" error={!!errors.ticketType}>
              <InputLabel>Ticket Type</InputLabel>
              <Select
                value={form.ticketType}
                onChange={handleChange("ticketType")}
                label="Ticket Type"
              >
                {TICKET_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              {errors.ticketType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.ticketType}
                </Typography>
              )}
            </FormControl>

            <TextField
              size="small"
              label="Subject"
              placeholder="Brief title for your request..."
              value={form.subject}
              onChange={handleChange("subject")}
              error={!!errors.subject}
              helperText={errors.subject}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: "text.disabled", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              size="small"
              label="Description"
              placeholder="Provide a short description of your request..."
              value={form.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
            />
          </Stack>

          {/* Submit */}
          <Box sx={{ pt: 0.5 }}>
            <Button
              variant="contained"
              fullWidth
              endIcon={<Send sx={{ fontSize: "18px !important" }} />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#122a42" },
              }}
            >
              {loading ? "Submitting…" : "Submit Request"}
            </Button>
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );
}

function SectionLabel({ icon, label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {icon}
      <Typography
        variant="overline"
        sx={{ color: "text.secondary", letterSpacing: 1.5, fontSize: "0.7rem" }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
