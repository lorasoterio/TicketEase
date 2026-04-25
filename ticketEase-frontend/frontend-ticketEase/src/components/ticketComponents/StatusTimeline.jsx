import { Box, Stack, Typography } from "@mui/material";

export default function StatusTimeline({ steps = [] }) {
  return (
    <Stack spacing={2}>
      {steps.map((step, i) => (
        <Stack direction="row" spacing={2} key={i}>
          {/* Indicator */}
          <Box
            sx={{
              width: 14,
              height: 14,
              mt: "4px",
              borderRadius: "50%",
              bgcolor: step.done ? "#1a56db" : "#d1d5db",
              position: "relative",
            }}
          >
            {i < steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 2,
                  height: 36,
                  bgcolor: step.done ? "#1a56db" : "#e5e7eb",
                }}
              />
            )}
          </Box>

          {/* Content */}
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {step.label}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: "text.secondary",
                fontFamily: "'Source Serif 4', serif",
              }}
            >
              {step.date || "Waiting..."}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}