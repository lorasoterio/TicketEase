import React, { useEffect, useState } from "react";
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  MenuItem, Paper, Stack, Avatar, CircularProgress,
  Alert, Collapse, InputAdornment, Divider,
} from "@mui/material";
import {
  Person, Email, Lock, Badge, Business, Phone, AdminPanelSettings,
} from "@mui/icons-material";
import GoldLine from "../../components/adminuis/GoldLine";
import StatusChip from "../../components/adminuis/StatusChip";
import CardTitle from "../../components/adminuis/CardTitle";
import { getAllStaff } from "../../services/userService";
import { useStaffRegisterForm } from "../../hooks/auth/useStaffRegisterForm";

const ROLES = [
  { value: "Staff", label: "Staff" },
  { value: "Admin", label: "Admin" },
];

const DEPARTMENTS = [
  "Registrar",
  "Admissions",
  "Finance",
  "IT Support",
  "Student Affairs",
  "Library",
  "Human Resources",
  "Other",
];

function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RegisterUser() {
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    form, errors, serverError, success, loading: formLoading,
    handleChange, handleRegister,
  } = useStaffRegisterForm();

  // Refresh recently registered list after a successful registration
  useEffect(() => {
    if (success) setRefreshKey((k) => k + 1);
  }, [success]);

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const staff = await getAllStaff();

        const staffMapped = staff.map((s) => ({
          id: `staff-${s.staffId}`,
          initials: getInitials(s.fullName),
          name: s.fullName,
          meta: `${s.department} · ${s.role ?? "Staff"} · ${timeAgo(s.createdAt)}`,
          isStaff: true,
          status: s.isActive ? "Active" : "Inactive",
          createdAt: s.createdAt,
        }));

        const sorted = staffMapped
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentUsers(sorted);
      } catch {
        setRecentUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentUsers();
  }, [refreshKey]);

  return (
    <Box>
      <GoldLine />
      <Grid container spacing={2.5}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", mb: 1.5 }}>
            <CardContent>
              <CardTitle>New User Registration</CardTitle>

              <Box
                component="form"
                onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
                noValidate
              >
                <Stack spacing={2} sx={{ mt: 1 }}>

                  <Collapse in={!!serverError}>
                    <Alert severity="error">{serverError}</Alert>
                  </Collapse>
                  <Collapse in={success}>
                    <Alert severity="success">Account created successfully.</Alert>
                  </Collapse>

                  {/* Role */}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5, display: "block" }}>
                    Account Role
                  </Typography>
                  <TextField
                    select size="small" label="Role"
                    value={form.role} onChange={handleChange("role")}
                    error={!!errors.role} helperText={errors.role}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AdminPanelSettings sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  >
                    {ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                  </TextField>

                  {/* Personal Info */}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5, display: "block" }}>
                    Personal Information
                  </Typography>
                  <TextField
                    size="small" label="Full Name" autoComplete="name"
                    value={form.fullName} onChange={handleChange("fullName")}
                    error={!!errors.fullName} helperText={errors.fullName}
                    placeholder="e.g. Maria Santos"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />
                  <TextField
                    size="small" label="Contact Number" autoComplete="tel"
                    value={form.contactNumber} onChange={handleChange("contactNumber")}
                    error={!!errors.contactNumber} helperText={errors.contactNumber}
                    placeholder="e.g. 09171234567"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />

                  {/* Work Info */}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5, display: "block" }}>
                    Work Information
                  </Typography>
                  <TextField
                    size="small" label="Position"
                    value={form.position} onChange={handleChange("position")}
                    error={!!errors.position} helperText={errors.position}
                    placeholder="e.g. Registrar Officer"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />
                  <TextField
                    select size="small" label="Department"
                    value={form.department} onChange={handleChange("department")}
                    error={!!errors.department} helperText={errors.department}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  >
                    {DEPARTMENTS.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                  </TextField>

                  {/* Credentials */}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main", borderBottom: "1px solid", borderColor: "divider", pb: 0.5, display: "block" }}>
                    Account Credentials
                  </Typography>
                  <TextField
                    size="small" label="Email" type="email" autoComplete="username"
                    value={form.email} onChange={handleChange("email")}
                    error={!!errors.email} helperText={errors.email}
                    placeholder="e.g. maria@university.edu.ph"
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />
                  <TextField
                    size="small" label="Password" type="password" autoComplete="new-password"
                    value={form.password} onChange={handleChange("password")}
                    error={!!errors.password} helperText={errors.password}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />
                  <TextField
                    size="small" label="Confirm Password" type="password" autoComplete="new-password"
                    value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment> }}
                  />

                  <Box sx={{ display: "flex", gap: 1, pt: 0.5 }}>
                    <Button type="submit" variant="contained" color="primary" size="small" disabled={formLoading}>
                      {formLoading ? "Creating…" : "Create Account"}
                    </Button>
                  </Box>

                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ borderLeft: "3px solid #c9993a", pl: 1.2, mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontSize: 12, color: "primary.main" }}>Recently Registered</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Last 5 accounts created</Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={1}>
              {recentUsers.length === 0 ? (
                <Typography sx={{ fontSize: 12, color: "text.secondary", textAlign: "center", py: 2 }}>
                  No users registered yet.
                </Typography>
              ) : (
                recentUsers.map((u) => (
                  <Paper key={u.id} variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 1.2, p: "10px 12px", borderColor: "rgba(26,58,92,0.12)" }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: u.isStaff ? "primary.main" : "secondary.main", color: u.isStaff ? "#fff" : "primary.dark" }}>{u.initials}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{u.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{u.meta}</Typography>
                    </Box>
                    <StatusChip status={u.status} />
                  </Paper>
                ))
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}