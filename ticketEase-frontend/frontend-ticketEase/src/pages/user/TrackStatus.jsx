import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
} from "@mui/material";

import useTrackStatus from "../../hooks/user/useTrackStatus";
import TicketStatusTable from "../../components/ticketComponents/TicketStatusTable";
import StatusTimeline from "../../components//ticketComponents/StatusTimeline";
import StaffInfoCard from "../../components/StaffInfoCard";
import StatusChip from "../../components/ticketComponents/StatusChip";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f0f4f8" },
  },
});

export default function TrackStatus() {
  const {
    search,
    setSearch,
    tickets,
    selectedTicket,
    selectTicket,
  } = useTrackStatus();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        {/* HEADER */}
        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Track Status
        </Typography>

        {/* SEARCH */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search ticket ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        {/* TABLE */}
        <TicketStatusTable
          tickets={tickets}
          selectedId={selectedTicket?.id}
          onSelect={selectTicket}
        />

        {/* DETAILS */}
        {selectedTicket && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <StatusChip label={selectedTicket.status} />
                <Box>
                  <Typography fontWeight={600}>
                    Current Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated {selectedTicket.updatedAt}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 2 }}>
                Progress Timeline
              </Typography>

              <StatusTimeline steps={selectedTicket.timeline} />
            </Paper>

            <StaffInfoCard staff={selectedTicket.assignedStaff} />

            {selectedTicket.remarks && (
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>
                  Remarks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTicket.remarks}
                </Typography>
              </Paper>
            )}

            {selectedTicket.eta && (
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>
                  Estimated Completion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTicket.eta}
                </Typography>
              </Paper>
            )}
          </Stack>
        )}
      </Box>
    </ThemeProvider>
  );
}