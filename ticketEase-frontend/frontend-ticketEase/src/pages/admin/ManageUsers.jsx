import React, { useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
// Helper to map role to MUI Chip color
const roleColor = {
  Admin: 'success',
  Staff: 'primary',
  'Data Export': 'info',
  'Data Import': 'secondary',
};

function RoleBadge({ role }) {
  return (
    <Chip
      label={role}
      color={roleColor[role] || 'default'}
      variant="outlined"
      size="small"
      sx={{ borderRadius: '16px', fontWeight: 500, mr: 0.5 }}
    />
  );
}
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  MenuItem, Paper, Stack, Avatar, CircularProgress,
  Alert, Collapse, InputAdornment, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {
  Person, Email, Lock, Badge, Business, Phone, AdminPanelSettings, Add as AddIcon
} from "@mui/icons-material";
import GoldLine from "../../components/adminuis/Goldline";
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



export default function ManageUsers() {

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    form, errors, serverError, success, loading: formLoading,
    handleChange, handleRegister,
  } = useStaffRegisterForm();

  // Refresh recently registered list after a successful registration
  useEffect(() => {
    if (success) {
      setRefreshKey((k) => k + 1);
      setModalOpen(false);
    }
  }, [success]);

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const staff = await getAllStaff();
        const staffMapped = staff.map((s) => ({
          id: `staff-${s.staffId}`,
          initials: getInitials(s.firstName + " " + s.lastName),
          fullname: s.firstName + " " + s.lastName,
          email: s.userEmail ?? s.email ?? "",
          roles: s.role ?? "Staff",
          activeSince: s.activatedAt || s.updatedAt || s.createdAt,
          createdAt: s.createdAt,
          isActive: s.isActive,
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
      {/* Top row: search left, add user right */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search users by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ maxWidth: 320, flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          startIcon={<AddIcon />}
          sx={{ minWidth: 0, px: 2, borderRadius: 2 }}
        >
          Add User
        </Button>
      </Box>
      {/* Table below */}
      <Box sx={{ mb: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">User</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Active Since</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.filter(u => u.fullname.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography sx={{ fontSize: 12, color: "text.secondary", py: 2 }}>
                        No users registered yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentUsers.filter(u => u.fullname.toLowerCase().includes(search.toLowerCase())).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: u.isActive ? "primary.main" : "grey.400", color: u.isActive ? "#fff" : "primary.dark" }}>{u.initials}</Avatar>
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{u.fullname}</Typography>
                            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>{u.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(u.roles)
                          ? u.roles.map((role, idx) => <RoleBadge key={idx} role={role} />)
                          : <RoleBadge role={u.roles} />}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 12 }}>{u.activeSince ? new Date(u.activeSince).toLocaleDateString() : "-"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {/* Add User Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New User Registration</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
            noValidate
            sx={{ mt: 1 }}
          >
            <Stack spacing={2}>
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="First Name"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  placeholder="e.g. Maria"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.disabled", fontSize: 20 }} /></InputAdornment> }}
                />
                <TextField
                  label="Last Name"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  placeholder="e.g. Santos"
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Middle Name"
                  autoComplete="additional-name"
                  value={form.middleName}
                  onChange={handleChange("middleName")}
                  error={!!errors.middleName}
                  helperText={errors.middleName}
                  placeholder="e.g. Cruz"
                />
                <TextField
                  label="Suffix"
                  value={form.suffix}
                  onChange={handleChange("suffix")}
                  error={!!errors.suffix}
                  helperText={errors.suffix}
                  placeholder="e.g. Jr., Sr., III"
                />
              </Stack>
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
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleRegister} color="primary" variant="contained" disabled={formLoading} type="submit">
            {formLoading ? "Creating…" : "Create Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}