import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
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
  CalendarMonth,
  Badge,
  Send,
  CheckCircle,
  ArticleOutlined,
} from "@mui/icons-material";

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
    button: {
      fontFamily: "'Source Serif 4', serif",
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiFormControl: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "'Source Serif 4', serif",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1a3a5c",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: "'Source Serif 4', serif" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontFamily: "'Source Serif 4', serif" },
      },
    },
  },
});

const documentTypes = [
  "Transcript of Records (TOR)",
  "Certificate of Enrollment",
  "Certificate of Graduation",
  "Certificate of Good Moral Character",
  "Diploma",
  "Form 137 / SF9",
  "Official Receipt of Payment",
  "Authentication of Documents",
  "Course Description",
  "Other",
];

const semesters = ["1st Semester", "2nd Semester", "Summer"];

const purposes = [
  "Employment / Job Application",
  "Graduate School Application",
  "Scholarship Application",
  "Educational Assistance",
  "Transfer to Another School",
  "Board Exam / Licensure",
  "Travel / Visa Application",
  "Personal Records",
  "Government Requirement",
  "Other",
];

const currentYear = new Date().getFullYear();
const schoolYears = Array.from({ length: 6 }, (_, i) => {
  const y = currentYear - i;
  return `${y - 1}–${y}`;
});

export default function DocumentRequestTicket() {
  const [form, setForm] = useState({
    studentId: "",
    documentType: "",
    semester: "",
    schoolYear: "",
    purpose: "",
    purposeDetails: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!form.documentType) e.documentType = "Please select a document type.";
    if (!form.semester) e.semester = "Please select a semester.";
    if (!form.schoolYear) e.schoolYear = "Please select a school year.";
    if (!form.purpose) e.purpose = "Please select a purpose.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    const ticket = `REG-${Date.now().toString().slice(-6)}`;
    setTicketNumber(ticket);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      studentId: "",
      documentType: "",
      semester: "",
      schoolYear: "",
      purpose: "",
      purposeDetails: "",
    });
    setErrors({});
    setSubmitted(false);
    setTicketNumber("");
  };

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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mb: 1.5,
              }}
            >
              <ArticleOutlined sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h4" color="primary.main">
              Office of the Registrar
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5, fontStyle: "italic" }}
            >
              Document Request Form
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderTop: "4px solid",
              borderTopColor: "secondary.main",
              p: { xs: 3, sm: 4 },
            }}
          >
            <Collapse in={submitted}>
              <Alert
                icon={<CheckCircle />}
                severity="success"
                sx={{
                  mb: 3,
                  fontFamily: "'Source Serif 4', serif",
                  "& .MuiAlert-message": {
                    fontFamily: "'Source Serif 4', serif",
                  },
                }}
                action={
                  <Button
                    size="small"
                    onClick={handleReset}
                    sx={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    New Request
                  </Button>
                }
              >
                <strong>Request submitted!</strong> Your ticket number is{" "}
                <Chip
                  label={ticketNumber}
                  size="small"
                  color="success"
                  sx={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700 }}
                />
                . Please keep this for follow-up.
              </Alert>
            </Collapse>

            <Collapse in={!submitted}>
              <Stack spacing={3}>
                {/* Section: Student Info */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Badge sx={{ color: "secondary.main", fontSize: 18 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontFamily: "'Source Serif 4', serif",
                        color: "text.secondary",
                        letterSpacing: 1.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Student Information
                    </Typography>
                  </Stack>
                  <TextField
                    label="Student ID"
                    value={form.studentId}
                    onChange={handleChange("studentId")}
                    error={!!errors.studentId}
                    helperText={errors.studentId}
                    placeholder="e.g. 2021-00123"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School sx={{ color: "text.disabled", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Divider />

                {/* Section: Document Details */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Description sx={{ color: "secondary.main", fontSize: 18 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontFamily: "'Source Serif 4', serif",
                        color: "text.secondary",
                        letterSpacing: 1.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Document Details
                    </Typography>
                  </Stack>
                  <Stack spacing={2.5}>
                    <FormControl error={!!errors.documentType}>
                      <InputLabel>Type of Document</InputLabel>
                      <Select
                        value={form.documentType}
                        onChange={handleChange("documentType")}
                        label="Type of Document"
                      >
                        {documentTypes.map((d) => (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.documentType && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.documentType}
                        </Typography>
                      )}
                    </FormControl>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <FormControl error={!!errors.semester}>
                        <InputLabel>Semester</InputLabel>
                        <Select
                          value={form.semester}
                          onChange={handleChange("semester")}
                          label="Semester"
                          startAdornment={
                            <InputAdornment position="start">
                              <CalendarMonth
                                sx={{ color: "text.disabled", fontSize: 18 }}
                              />
                            </InputAdornment>
                          }
                        >
                          {semesters.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.semester && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {errors.semester}
                          </Typography>
                        )}
                      </FormControl>

                      <FormControl error={!!errors.schoolYear}>
                        <InputLabel>School Year</InputLabel>
                        <Select
                          value={form.schoolYear}
                          onChange={handleChange("schoolYear")}
                          label="School Year"
                        >
                          {schoolYears.map((y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.schoolYear && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {errors.schoolYear}
                          </Typography>
                        )}
                      </FormControl>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {/* Section: Purpose */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Description sx={{ color: "secondary.main", fontSize: 18 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontFamily: "'Source Serif 4', serif",
                        color: "text.secondary",
                        letterSpacing: 1.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Purpose
                    </Typography>
                  </Stack>
                  <Stack spacing={2.5}>
                    <FormControl error={!!errors.purpose}>
                      <InputLabel>Purpose of Request</InputLabel>
                      <Select
                        value={form.purpose}
                        onChange={handleChange("purpose")}
                        label="Purpose of Request"
                      >
                        {purposes.map((p) => (
                          <MenuItem key={p} value={p}>
                            {p}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.purpose && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.purpose}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Additional Details (optional)"
                      value={form.purposeDetails}
                      onChange={handleChange("purposeDetails")}
                      multiline
                      rows={3}
                      placeholder="Provide any additional information relevant to your request…"
                    />
                  </Stack>
                </Box>

                <Box sx={{ pt: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<Send sx={{ fontSize: "18px !important" }} />}
                    onClick={handleSubmit}
                    sx={{
                      bgcolor: "primary.main",
                      py: 1.6,
                      fontSize: "0.95rem",
                      "&:hover": { bgcolor: "#122a42" },
                      boxShadow: "0 4px 14px rgba(26,58,92,0.25)",
                    }}
                  >
                    Submit Request
                  </Button>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: 1.5, fontStyle: "italic" }}
                  >
                    Processing takes 3–5 working days. You will be notified via
                    your institutional email.
                  </Typography>
                </Box>
              </Stack>
            </Collapse>
          </Paper>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            color="text.disabled"
            sx={{ mt: 2, fontFamily: "'Source Serif 4', serif" }}
          >
            © Office of the Registrar · For concerns, email registrar@university.edu.ph
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
