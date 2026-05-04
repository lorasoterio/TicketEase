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
  Button,
  Collapse,
} from "@mui/material";
import { Add, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

import useMyTickets from "../../hooks/user/useMyTickets";
import TicketRow from "../../components/ticketComponents/TicketRow";
import TicketRequestForm from "../../components/ticketComponents/TicketRequestForm";
import TicketDetailModal from "../../components/ticketComponents/TicketDetailModal";

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
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const {
    tickets,
    status,
    ticketType,
    search,
    page,
    setPage,
    pageCount,
    handleSetStatus,
    handleSetTicketType,
    handleSetSearch,
    refetch,
  } = useMyTickets();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        {/* Header row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography fontWeight={600}>My Tickets</Typography>
          <Button
            variant={showForm ? "outlined" : "contained"}
            size="small"
            startIcon={showForm ? <ExpandLess /> : <Add />}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "New Ticket"}
          </Button>
        </Stack>

        {/* Request Ticket Form */}
        <Collapse in={showForm} unmountOnExit>
          <Box sx={{ mb: 2 }}>
            <TicketRequestForm onSuccess={refetch} onSubmitted={() => setShowForm(false)} />
          </Box>
        </Collapse>

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
              value={ticketType}
              onChange={(e) => handleSetTicketType(e.target.value)}
              label="Type"
              sx={{ minWidth: { xs: "100%", sm: 160 } }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Document Request">Document Request</MenuItem>
              <MenuItem value="Inquiry">Inquiry</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              value={status}
              onChange={(e) => handleSetStatus(e.target.value)}
              label="Status"
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
              <TicketRow ticket={t} onView={setSelectedTicket} />
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

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </ThemeProvider>
  );
}
