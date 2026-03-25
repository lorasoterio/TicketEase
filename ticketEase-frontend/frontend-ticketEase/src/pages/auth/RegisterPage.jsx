import {
  ThemeProvider, createTheme, CssBaseline, Box, Paper,
  Typography, TextField, Button, Stack, Alert, Collapse,
  InputAdornment, Divider,
} from "@mui/material";
import { School, Person, Email, Lock, HowToReg } from "@mui/icons-material";
import { Link } from "react-router-dom";
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
  } = useRegisterForm();

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
        <Box sx={{ width: "100%", maxWidth: 520 }}>

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
            <Stack spacing={2.5}>

              {/* Server Error */}
              <Collapse in={!!serverError}>
                <Alert severity="error" sx={{ "& .MuiAlert-message": { fontFamily: "'Source Serif 4', serif" } }}>
                  {serverError}
                </Alert>
              </Collapse>

              <TextField
                label="Full Name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                placeholder="e.g. Juan dela Cruz"
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />
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
                label="Email"
                type="email"
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
                value={form.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
              />

              <Button
                variant="contained" fullWidth size="large"
                onClick={handleRegister} disabled={loading}
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
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}