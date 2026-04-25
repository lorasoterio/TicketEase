import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Divider,
  Pagination,
} from "@mui/material";

import useMyTickets from "../../hooks/user/useMyTickets";
import TicketRow from "../../components/ticketComponents/TicketRow";

/* same dashboard theme */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a3a5c" },
    secondary: { main: "#c9993a" },
    background: { default: "#f0f4f8", paper: "#ffffff" },
  },
});

export default function MyTickets() {
  const {
    tickets,
    status,
    search,
    page,
    setPage,
    pageCount,
    handleSetStatus,
    handleSetSearch,
  } = useMyTickets();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        <Typography fontWeight={600} sx={{ mb: 2 }}>
          My Tickets
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSetSearch(e.target.value)}
              fullWidth
            />

            <TextField
              select
              size="small"
              value={status}
              onChange={(e) => handleSetStatus(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 160 } }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In progress">In progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* List */}
        <Paper sx={{ overflow: "hidden" }}>
          {tickets.map((t, i) => (
            <Box key={t.id}>
              <TicketRow ticket={t} />
              {i < tickets.length - 1 && <Divider />}
            </Box>
          ))}

          {tickets.length === 0 && (
            <Typography
              sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
            >
              No tickets found.
            </Typography>
          )}
        </Paper>

        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
          />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
