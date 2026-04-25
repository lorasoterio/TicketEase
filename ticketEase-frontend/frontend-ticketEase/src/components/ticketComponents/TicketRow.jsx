import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "./StatusChip";

export default function TicketRow({ ticket }) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      sx={{
        px: 2,
        py: 1.5,
        cursor: "pointer",
        transition: "0.15s",
        "&:hover": { bgcolor: "#f8fafc" },
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 1.5 }} alignItems={{ xs: "flex-start", sm: "center" }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" } }}>
          <StatusChip label={ticket.status} />

          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {ticket.subject}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: "text.secondary",
                fontFamily: "'Source Serif 4', serif",
              }}
            >
              {ticket.type} · Submitted {ticket.date}
            </Typography>
          </Box>
        </Stack>

        <Typography
          sx={{
            fontSize: "11px",
            color: "text.secondary",
            fontFamily: "'Source Serif 4', serif",
            ml: { xs: 0, sm: "auto" },
            flexShrink: 0,
          }}
        >
          {ticket.id}
        </Typography>
      </Stack>
    </Box>
  );
}