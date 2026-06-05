import {
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";

import TicketRequestForm from "../../components/ticketComponents/TicketRequestForm";
import { dashboardTheme } from "../../components/themes/dashboardTheme";

export default function RequestTicket() {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <TicketRequestForm />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
