import React from "react";
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
  Divider,
  Pagination,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import GoldLine from "../../components/adminuis/Goldline";
import useAuditLogs from "../../hooks/admin/useAuditLogs";

const ACTION_COLORS = {
  Create:   { bg: "#dcfce7", color: "#166534" },
  Update:   { bg: "#dbeafe", color: "#1d4ed8" },
  Delete:   { bg: "#fee2e2", color: "#b91c1c" },
  Login:    { bg: "#ede9fe", color: "#6d28d9" },
  Logout:   { bg: "#f3f4f6", color: "#374151" },
  Register: { bg: "#fef9c3", color: "#854d0e" },
};

function ActionChip({ type }) {
  const styles = ACTION_COLORS[type] || { bg: "#f0f4f8", color: "#5a6a7e" };
  return (
    <Chip
      label={type || "—"}
      size="small"
      sx={{ bgcolor: styles.bg, color: styles.color, fontWeight: 700, fontSize: 10, height: 20, px: 0.5 }}
    />
  );
}

function JsonBlock({ label, value }) {
  if (!value) return null;
  let parsed = value;
  try { parsed = JSON.stringify(JSON.parse(value), null, 2); } catch { /* keep raw */ }
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
        {label}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.2,
          bgcolor: "rgba(26,58,92,0.04)",
          border: "1px solid rgba(26,58,92,0.12)",
          borderRadius: 1,
          fontSize: 11,
          fontFamily: "monospace",
          overflowX: "auto",
          maxHeight: 160,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          color: "text.primary",
        }}
      >
        {parsed}
      </Box>
    </Box>
  );
}

export default function AuditLogs() {
  const {
    rows,
    loading,
    error,
    search,
    setSearch,
    actionFilter,
    setActionFilter,
    entityFilter,
    setEntityFilter,
    actionTypes,
    entityTypes,
    page,
    setPage,
    totalPages,
    total,
    detailLog,
    setDetailLog,
  } = useAuditLogs();

  return (
    <Box>
      <GoldLine />

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HistoryIcon sx={{ fontSize: 18, color: "secondary.main" }} />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "primary.main", fontFamily: "'Georgia', serif" }}>
          Audit Logs
        </Typography>
        <Chip
          label={`${total} record${total !== 1 ? "s" : ""}`}
          size="small"
          sx={{ ml: "auto", bgcolor: "rgba(26,58,92,0.08)", color: "primary.main", fontWeight: 700, fontSize: 10, height: 20 }}
        />
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search by user, action, entity…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 280, "& .MuiInputBase-input": { fontSize: 12 } }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            displayEmpty
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Actions</MenuItem>
            {actionTypes.map((a) => (
              <MenuItem key={a} value={a} sx={{ fontSize: 12 }}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            displayEmpty
            sx={{ fontSize: 12 }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Entities</MenuItem>
            {entityTypes.map((e) => (
              <MenuItem key={e} value={e} sx={{ fontSize: 12 }}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ borderColor: "rgba(26,58,92,0.12)", p: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(26,58,92,0.04)" }}>
                {["Log ID", "User", "Action", "Entity", "Entity ID", "Timestamp", "Details"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontSize: 11, fontWeight: 700, color: "primary.main", textTransform: "uppercase", letterSpacing: "0.05em", py: 1 }}
                  >
                    {h}
                  </TableCell>
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
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, fontSize: 12, color: "text.secondary" }}>
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((log) => (
                  <TableRow
                    key={log.logId}
                    hover
                    sx={{ "&:last-child td": { border: 0 }, cursor: "default" }}
                  >
                    <TableCell sx={{ fontSize: 11, color: "text.secondary" }}>#{log.logId}</TableCell>
                    <TableCell sx={{ fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.userEmail ?? "—"}
                    </TableCell>
                    <TableCell>
                      <ActionChip type={log.actionType} />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{log.entityType || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                      {log.entityId != null ? log.entityId : "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, color: "text.secondary", whiteSpace: "nowrap" }}>
                      {log.formattedDate}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDetailLog(log)}
                        sx={{
                          fontSize: 10,
                          py: 0.3,
                          px: 1,
                          minWidth: 0,
                          borderColor: "rgba(26,58,92,0.25)",
                          color: "primary.main",
                          textTransform: "none",
                          "&:hover": { borderColor: "primary.main", bgcolor: "rgba(26,58,92,0.04)" },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5, borderTop: "1px solid rgba(26,58,92,0.08)" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="small"
              sx={{
                "& .MuiPaginationItem-root": { fontSize: 11 },
                "& .Mui-selected": { bgcolor: "primary.main !important", color: "#fff" },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={Boolean(detailLog)}
        onClose={() => setDetailLog(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {detailLog && (
          <>
            <DialogTitle sx={{ fontSize: 14, fontWeight: 700, color: "primary.main", fontFamily: "'Georgia', serif", pb: 1 }}>
              Audit Log #{detailLog.logId}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>User</Typography>
                    <Typography sx={{ fontSize: 12, mt: 0.3 }}>{detailLog.userEmail ?? "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>Action</Typography>
                    <Box sx={{ mt: 0.3 }}><ActionChip type={detailLog.actionType} /></Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entity Type</Typography>
                    <Typography sx={{ fontSize: 12, mt: 0.3 }}>{detailLog.entityType || "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entity ID</Typography>
                    <Typography sx={{ fontSize: 12, mt: 0.3 }}>{detailLog.entityId != null ? detailLog.entityId : "—"}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>Timestamp</Typography>
                    <Typography sx={{ fontSize: 12, mt: 0.3 }}>{detailLog.formattedDate}</Typography>
                  </Box>
                </Box>
                <Divider />
                <JsonBlock label="Old Values" value={detailLog.oldValues} />
                <JsonBlock label="New Values" value={detailLog.newValues} />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDetailLog(null)}
                size="small"
                variant="contained"
                sx={{ fontSize: 11, textTransform: "none", bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
