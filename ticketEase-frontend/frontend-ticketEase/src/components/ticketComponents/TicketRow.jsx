import { Box, Stack, Typography, Button } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import StatusChip from "./StatusChip";

export default function TicketRow({ ticket, onView }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        transition: "0.15s",
        "&:hover": { bgcolor: "#f8fafc" },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 0.5, sm: 1.5 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" }, flex: 1 }}
        >
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

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexShrink: 0, ml: { xs: 0, sm: "auto" } }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              color: "text.secondary",
              fontFamily: "'Source Serif 4', serif",
            }}
          >
            {ticket.id}
          </Typography>

          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility sx={{ fontSize: 14 }} />}
            onClick={() => onView?.(ticket)}
            sx={{ fontSize: "11px", py: 0.3, px: 1, minWidth: 0 }}
          >
            View
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}