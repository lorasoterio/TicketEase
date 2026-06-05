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
    ticketType,
    search,
    page,
    setPage,
    pageCount,
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
          </Stack>
        </Paper>

        {/* List */}
        <Paper sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontSize: "11px", fontWeight: 600, flex: 1 }}>
                Ticket
              </Typography>
              <Typography sx={{ fontSize: "11px", fontWeight: 600, width: 220, mr: 1 }}>
                Remarks
              </Typography>
              <Typography sx={{ fontSize: "11px", fontWeight: 600, width: 72 }}>
                Ticket ID
              </Typography>
              <Box sx={{ width: 74 }} />
            </Stack>
          </Box>

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
