import React from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  FormControl, Select, MenuItem, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, CircularProgress,
  Alert, Chip, Tooltip, Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import GoldLine from "../../components/adminuis/Goldline";
import CardTitle from "../../components/adminuis/CardTitle";
import useVerifyStudents from "../../hooks/admin/useVerifyStudents";

export default function VerifyStudents() {
  const {
    students,
    loading,
    error,
    actionLoading,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    total,
    verifiedCount,
    unverifiedCount,
    handleVerify,
    handleUnverify,
  } = useVerifyStudents();

  return (
    <Box>
      <GoldLine />

      {/* ── Summary Chips ── */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <SummaryChip label="All Students" value={verifiedCount + unverifiedCount} color="primary.main" />
        <SummaryChip label="Verified" value={verifiedCount} color="success.main" />
        <SummaryChip label="Pending" value={unverifiedCount} color="warning.main" />
      </Stack>

      {/* ── Filters ── */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name, ID, course, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 320, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="all" sx={{ fontSize: 12 }}>All Students</MenuItem>
            <MenuItem value="verified" sx={{ fontSize: 12 }}>Verified</MenuItem>
            <MenuItem value="unverified" sx={{ fontSize: 12 }}>Unverified</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>{error}</Alert>}

      {/* ── Table ── */}
      <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", p: 0, overflow: "hidden" }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <CardTitle sx={{ px: 2, pt: 1.5, pb: 0 }}>Student Verification</CardTitle>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Student ID", "Full Name", "Course / Program", "Year", "Email", "Status", "Action"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</TableCell>
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
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, fontSize: 12, color: "text.secondary" }}>
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => {
                    const isActing = actionLoading === s.studentId;
                    return (
                      <TableRow key={s.studentId} hover>
                        <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>{s.schoolStudentId || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{s.fullName || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{s.courseProgram || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{s.yearLevel || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{s.userEmail || "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={s.isVerified ? "Verified" : "Unverified"}
                            size="small"
                            sx={{
                              fontSize: 10,
                              fontWeight: 600,
                              bgcolor: s.isVerified ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                              color: s.isVerified ? "success.main" : "warning.dark",
                              border: "none",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {s.isVerified ? (
                            <Tooltip title="Revoke verification">
                              <span>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={isActing ? <CircularProgress size={12} /> : <CancelOutlinedIcon />}
                                  disabled={isActing}
                                  onClick={() => handleUnverify(s.studentId)}
                                  sx={{ fontSize: 10, py: 0.3, px: 1 }}
                                >
                                  Revoke
                                </Button>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Verify this student">
                              <span>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={isActing ? <CircularProgress size={12} /> : <CheckCircleOutlineIcon />}
                                  disabled={isActing}
                                  onClick={() => handleVerify(s.studentId)}
                                  sx={{ fontSize: 10, py: 0.3, px: 1 }}
                                >
                                  Verify
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Showing {students.length} of {total} students
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
    </Box>
  );
}

function SummaryChip({ label, value, color }) {
  return (
    <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", minWidth: 110 }}>
      <CardContent sx={{ p: "10px 14px !important" }}>
        <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
