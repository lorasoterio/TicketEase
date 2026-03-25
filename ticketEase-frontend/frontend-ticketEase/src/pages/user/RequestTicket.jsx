// DocumentRequestPage.jsx
// ─────────────────────────────────────────────────────────────
// This file is ONLY responsible for the UI layout.
// All logic lives in useTicketForm (hook) and ticketHelpers (utils).
// ─────────────────────────────────────────────────────────────

import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, TextField, MenuItem, Select, InputLabel,
  FormControl, Button, Divider, Chip, Stack, Alert,
  Collapse, InputAdornment,
} from "@mui/material";
import {
  School, Description, CalendarMonth, Badge, Send,
  CheckCircle, ArticleOutlined,
} from "@mui/icons-material";

// ── Import logic from separate files ──────────────────────────
import { useTicketForm } from "../../hooks/useTicketForm";
import {
  validateDocumentRequest,
  DOCUMENT_TYPES,
} from "../../utils/ticketHelpers";

// ── MUI Theme (can also be moved to a theme.js file later) ────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a3a5c" },
    secondary: { main: "#c9993a" },
    background: { default: "#f0f4f8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h6: { fontWeight: 600 },
    body1: { fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem" },
    button: { fontFamily: "'Source Serif 4', serif", fontWeight: 600, letterSpacing: "0.5px" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiTextField: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiFormControl: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "'Source Serif 4', serif",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1a3a5c" },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: "'Source Serif 4', serif" } } },
    MuiMenuItem: { styleOverrides: { root: { fontFamily: "'Source Serif 4', serif" } } },
  },
});

// ── Initial empty form fields for this specific form ──────────
const INITIAL_FIELDS = {
  studentId: "",
  fullName: "",
  documentType: "",
  subject: "",
  description: "",
  purpose: "",
  purposeDetails: "",
};

// ─────────────────────────────────────────────────────────────
export default function DocumentRequestPage() {
  // All state and handlers come from the reusable hook.
  // "REG" is the ticket prefix for the Registrar's office.
  const { form, errors, submitted, ticketNumber, handleChange, handleSubmit, handleReset } =
    useTicketForm(INITIAL_FIELDS, validateDocumentRequest, "REG");

  // ── Render ──────────────────────────────────────────────────
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap"
        rel="stylesheet"
      />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #d0dce8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #e8d9c0 0%, transparent 50%)",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 620 }}>
          {/* ── Header ── */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 56, height: 56, borderRadius: "50%", bgcolor: "primary.main", mb: 1.5,
              }}
            >
              <ArticleOutlined sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h4" color="primary.main">Office of the Registrar</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontStyle: "italic" }}>
              Document Request Form
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid", borderColor: "divider",
              borderTop: "4px solid", borderTopColor: "secondary.main",
              p: { xs: 3, sm: 4 },
            }}
          >
            {/* ── Success State ── */}
            <Collapse in={submitted}>
              <Alert
                icon={<CheckCircle />}
                severity="success"
                sx={{ mb: 3, "& .MuiAlert-message": { fontFamily: "'Source Serif 4', serif" } }}
                action={
                  <Button size="small" onClick={handleReset}
                    sx={{ fontFamily: "'Source Serif 4', serif" }}>
                    New Request
                  </Button>
                }
              >
                <strong>Request submitted!</strong> Your ticket number is{" "}
                <Chip label={ticketNumber} size="small" color="success"
                  sx={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700 }} />.
                Please keep this for follow-up.
              </Alert>
            </Collapse>

            {/* ── Form ── */}
            <Collapse in={!submitted}>
              <Stack spacing={3}>

                {/* Section: Student Info */}
                <SectionLabel icon={<Badge sx={{ color: "secondary.main", fontSize: 18 }} />} label="Student Information" />
                <Stack spacing={2.5}>
                  <TextField
                    label="Student ID"
                    value={form.studentId}
                    onChange={handleChange("studentId")}
                    error={!!errors.studentId}
                    helperText={errors.studentId}
                    placeholder="e.g. 2021-00123"
                    InputProps={{ startAdornment: <InputAdornment position="start"><School sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                  />
                  <TextField
                    label="Full Name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    placeholder="e.g. Juan dela Cruz"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                  />
                </Stack>

                <Divider />

                {/* Section: Document Details */}
                <SectionLabel icon={<Description sx={{ color: "secondary.main", fontSize: 18 }} />} label="Document Details" />
                <Stack spacing={2.5}>
                  <FormControl error={!!errors.documentType}>
                    <InputLabel>Type of Ticket</InputLabel>
                    <Select value={form.documentType} onChange={handleChange("documentType")} label="Type of Document">
                      {TICKET_CATEGORIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </Select>
                    {errors.documentType && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.documentType}</Typography>}
                  </FormControl>

                  <TextField
                    label="Subject"
                    value={form.subject}
                    onChange={handleChange("subject")}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="e.g. Transcript of Records"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Description sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                  />

                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={handleChange("description")}
                    error={!!errors.description}
                    helperText={errors.description}
                    multiline
                    rows={3}
                    placeholder="Provide a short description of your request..."
                  />
                </Stack>

                {/* Submit Button */}
                <Box sx={{ pt: 1 }}>
                  <Button
                    variant="contained" fullWidth size="large"
                    endIcon={<Send sx={{ fontSize: "18px !important" }} />}
                    onClick={handleSubmit}
                    sx={{ bgcolor: "primary.main", py: 1.6, fontSize: "0.95rem", "&:hover": { bgcolor: "#122a42" }, boxShadow: "0 4px 14px rgba(26,58,92,0.25)" }}
                  >
                    Submit Request
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" textAlign="center" sx={{ mt: 1.5, fontStyle: "italic" }}>
                    Processing takes 3–5 working days. You will be notified via your institutional email.
                  </Typography>
                </Box>

              </Stack>
            </Collapse>
          </Paper>

          <Typography variant="caption" display="block" textAlign="center" color="text.disabled" sx={{ mt: 2, fontFamily: "'Source Serif 4', serif" }}>
            © Office of the Registrar · For concerns, email registrar@university.edu.ph
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// ── Small reusable UI helper (local to this file) ─────────────
// Not complex enough to be its own file, but keeps JSX clean.
function SectionLabel({ icon, label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {icon}
      <Typography variant="overline" sx={{ fontFamily: "'Source Serif 4', serif", color: "text.secondary", letterSpacing: 1.5, fontSize: "0.7rem" }}>
        {label}
      </Typography>
    </Stack>
  );
}
