import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, TextField, Button, Stack, Alert, Collapse,
  InputAdornment, Divider, MenuItem, Checkbox, FormControlLabel,
} from "@mui/material";
import {
  School, Person, Email, Lock, HowToReg,
  MenuBook, CalendarToday, Phone, Home,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm";

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
    body1: { fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem" },
    button: { fontFamily: "'Source Serif 4', serif", fontWeight: 600, letterSpacing: "0.5px" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiTextField: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "'Source Serif 4', serif",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1a3a5c" },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: "'Source Serif 4', serif" } } },
  },
});

export default function RegisterPage() {

  const {
    form, errors, serverError, loading,
    handleChange, handleRegister,
    fetchDropdownData,
  } = useRegisterForm();

  const [strands, setStrands] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      setLoadingDropdowns(true);
      try {
        // fetchDropdownData is expected to fetch and return the data
        const data = await fetchDropdownData();
        // If fetchDropdownData returns nothing, fallback to legacy
        if (data && data.strands && data.gradeLevels) {
          setStrands(data.strands);
          setGradeLevels(data.gradeLevels);
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoadingDropdowns(false);
      }
    }
    loadDropdowns();
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
      <Box
        sx={{
          minHeight: "100vh", bgcolor: "background.default",
          display: "flex", alignItems: "center", justifyContent: "center",
          p: { xs: 2, sm: 4 },
          backgroundImage: "radial-gradient(circle at 20% 20%, #d0dce8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #e8d9c0 0%, transparent 50%)",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 560 }}>

          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", bgcolor: "primary.main", mb: 1.5 }}>
              <HowToReg sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h4" color="primary.main">Create Account</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontStyle: "italic" }}>
              Student Registration
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderTop: "4px solid", borderTopColor: "secondary.main", p: { xs: 3, sm: 4 } }}>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }} noValidate>
            <Stack spacing={2.5}>

              {/* Server Error */}
              <Collapse in={!!serverError}>
                <Alert severity="error" sx={{ "& .MuiAlert-message": { fontFamily: "'Source Serif 4', serif" } }}>
                  {serverError}
                </Alert>
              </Collapse>

              {/* Personal Info Section */}
              <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5 }}>
                Personal Information
              </Typography>


              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="First Name"
                  value={form.firstName || ""}
                  onChange={handleChange("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  placeholder="e.g. Juan"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                />
                <TextField
                  label="Last Name"
                  value={form.lastName || ""}
                  onChange={handleChange("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  placeholder="e.g. Dela Cruz"
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Middle Name"
                  value={form.middleName || ""}
                  onChange={handleChange("middleName")}
                  error={!!errors.middleName}
                  helperText={errors.middleName}
                  placeholder="e.g. Santos"
                />
                <TextField
                  label="Suffix (optional)"
                  value={form.suffix || ""}
                  onChange={handleChange("suffix")}
                  error={!!errors.suffix}
                  helperText={errors.suffix}
                  placeholder="e.g. Jr., III, IV"
                />
              </Stack>

              


              {/* Academic Info Section */}
              <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5 }}>
                Academic Information
              </Typography>

              <TextField
                label="School Student ID"
                value={form.schoolStudentId}
                onChange={handleChange("schoolStudentId")}
                error={!!errors.schoolStudentId}
                helperText={errors.schoolStudentId}
                placeholder="e.g. 2021-00123"
                InputProps={{ startAdornment: <InputAdornment position="start"><School sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                select
                label="Strand"
                value={form.strandId || ""}
                onChange={handleChange("strandId")}
                error={!!errors.strandId}
                helperText={errors.strandId}
                InputProps={{ startAdornment: <InputAdornment position="start"><MenuBook sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                disabled={loadingDropdowns}
              >
                {strands.map((strand) => (
                  <MenuItem key={strand.strandId} value={strand.strandId} sx={{ fontFamily: "'Source Serif 4', serif" }}>
                    {strand.strandName} ({strand.strandCode})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Year Level"
                value={form.gradeLevelId || ""}
                onChange={handleChange("gradeLevelId")}
                error={!!errors.gradeLevelId}
                helperText={errors.gradeLevelId}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                disabled={loadingDropdowns}
              >
                {gradeLevels
                  .sort((a, b) => a.levelOrder - b.levelOrder)
                  .map((level) => (
                    <MenuItem key={level.gradeLevelId} value={level.gradeLevelId} sx={{ fontFamily: "'Source Serif 4', serif" }}>
                      {level.gradeLevelName}
                    </MenuItem>
                  ))}
              </TextField>

              {/* Graduate Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!form.isGraduate}
                    onChange={e => handleChange("isGraduate")({ target: { value: e.target.checked } })}
                    color="primary"
                  />
                }
                label="I am a graduate"
                sx={{ fontFamily: "'Source Serif 4', serif", ml: 0.5 }}
              />

              {/* Account Info Section */}
              <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5 }}>
                Account Credentials
              </Typography>

              <TextField
                label="Email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="e.g. juan@university.edu.ph"
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />

              <Button
                type="submit"
                variant="contained" fullWidth size="large"
                disabled={loading}
                sx={{ bgcolor: "primary.main", py: 1.6, fontSize: "0.95rem", "&:hover": { bgcolor: "#122a42" }, boxShadow: "0 4px 14px rgba(26,58,92,0.25)" }}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>

              <Divider />

              <Typography variant="body1" textAlign="center" color="text.secondary">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1a3a5c", fontWeight: 600 }}>Sign in here</Link>
              </Typography>

            </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}