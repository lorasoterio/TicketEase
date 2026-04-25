import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StatusChip from "./StatusChip";

export default function TicketStatusTable({
  tickets,
  onSelect,
  selectedId,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ticket</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Update</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((t) => (
            <TableRow
              key={t.id}
              hover
              selected={selectedId === t.id}
              onClick={() => onSelect(t)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {t.subject}
                </Typography>
                <Typography
                  sx={{ fontSize: "11px", color: "text.secondary" }}
                >
                  {t.id}
                </Typography>
              </TableCell>

              <TableCell>
                <StatusChip label={t.status} />
              </TableCell>

              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {t.updatedAt}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}