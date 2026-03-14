// GeneralInquiryPage.jsx
// ─────────────────────────────────────────────────────────────
// A SECOND ticket form that reuses the exact same hook and utils.
// This proves the separation works — zero logic duplication.
// ─────────────────────────────────────────────────────────────

import {
  Box, Paper, Typography, TextField, Button, Stack,
  Alert, Collapse, Chip, InputAdornment, CssBaseline, ThemeProvider, createTheme,
} from "@mui/material";
import { School, Badge, Send, CheckCircle, HelpOutline } from "@mui/icons-material";

// ── Same hook, different form ─────────────────────────────────
import { useTicketForm } from "../../hooks/useTicketForm";
import { validateGeneralInquiry } from "../../utils/ticketHelpers"; // different validator

const theme = createTheme({
  palette: { primary: { main: "#1a3a5c" }, secondary: { main: "#c9993a" } },
});

const INITIAL_FIELDS = { studentId: "", fullName: "", subject: "", message: "" };

export default function GeneralInquiryPage() {
  // "INQ" prefix → tickets will look like INQ-483920
  const { form, errors, submitted, ticketNumber, handleChange, handleSubmit, handleReset } =
    useTicketForm(INITIAL_FIELDS, validateGeneralInquiry, "INQ");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 4, bgcolor: "#f0f4f8" }}>
        <Box sx={{ width: "100%", maxWidth: 560 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <HelpOutline sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h5" fontWeight={700} color="primary.main">General Inquiry</Typography>
            <Typography variant="body2" color="text.secondary">Submit a concern or question to our support team.</Typography>
          </Box>

          <Paper sx={{ p: 4, border: "1px solid #ddd", borderTop: "4px solid #c9993a" }} elevation={0}>
            <Collapse in={submitted}>
              <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 3 }}
                action={<Button size="small" onClick={handleReset}>New Inquiry</Button>}>
                <strong>Inquiry submitted!</strong> Reference:{" "}
                <Chip label={ticketNumber} size="small" color="success" sx={{ fontWeight: 700 }} />
              </Alert>
            </Collapse>

            <Collapse in={!submitted}>
              <Stack spacing={2.5}>
                <TextField label="Student ID" value={form.studentId} onChange={handleChange("studentId")}
                  error={!!errors.studentId} helperText={errors.studentId} placeholder="e.g. 2021-00123"
                  InputProps={{ startAdornment: <InputAdornment position="start"><School sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }} />

                <TextField label="Full Name" value={form.fullName} onChange={handleChange("fullName")}
                  error={!!errors.fullName} helperText={errors.fullName}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }} />

                <TextField label="Subject" value={form.subject} onChange={handleChange("subject")}
                  error={!!errors.subject} helperText={errors.subject}
                  placeholder="e.g. Missing grade for BSCS 3A" />

                <TextField label="Message / Concern" value={form.message} onChange={handleChange("message")}
                  error={!!errors.message} helperText={errors.message}
                  multiline rows={4} placeholder="Describe your concern in detail…" />

                <Button variant="contained" fullWidth size="large" onClick={handleSubmit}
                  endIcon={<Send />} sx={{ py: 1.5, bgcolor: "primary.main" }}>
                  Submit Inquiry
                </Button>
              </Stack>
            </Collapse>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
