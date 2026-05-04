import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";

import useTicketDetail from "../../hooks/user/useTicketDetail";
import StatusChip from "./StatusChip";

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ─── single chat bubble ─── */
function MessageBubble({ msg, currentUserId }) {
  const isMine = currentUserId != null && Number(msg.senderId) === Number(currentUserId);
  return (
    <Stack
      direction="column"
      alignItems={isMine ? "flex-end" : "flex-start"}
      sx={{ mb: 1.5 }}
    >
      <Typography
        sx={{ fontSize: "11px", color: "text.secondary", mb: 0.3, px: 0.5 }}
      >
        {isMine ? "You" : msg.senderName ?? "Staff"} · {formatDate(msg.createdAt)}
      </Typography>

      <Box
        sx={{
          maxWidth: "75%",
          px: 1.5,
          py: 1,
          borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          bgcolor: isMine ? "#1a3a5c" : "#f0f4f8",
          color: isMine ? "#fff" : "text.primary",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.message}
        </Typography>
      </Box>
    </Stack>
  );
}

/* ─── main modal ─── */
export default function TicketDetailModal({ ticket, onClose }) {
  const open = Boolean(ticket);
  const ticketId = ticket?.ticketId ?? null;
  const { detail, messages, loading, sending, error, sendMessage, currentUserId } =
    useTicketDetail(ticketId);

  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  const isInquiry = ticket?.type === "Inquiry";

  /* scroll to bottom when new messages arrive */
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          pb: 1,
          pr: 6,
          bgcolor: "#1a3a5c",
          color: "#fff",
          fontWeight: 600,
          fontSize: "15px",
        }}
      >
        Ticket Details
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <Box sx={{ p: 2.5 }}>
            <Skeleton height={28} width="60%" sx={{ mb: 1 }} />
            <Skeleton height={18} width="40%" />
            <Skeleton height={18} width="30%" sx={{ mt: 0.5 }} />
            <Skeleton height={60} sx={{ mt: 2 }} />
          </Box>
        ) : (
          <>
            {/* ── Ticket info ── */}
            <Box sx={{ p: 2.5, pb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <StatusChip label={ticket?.status} />
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "#f0f4f8",
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    color: "text.secondary",
                    fontFamily: "'Source Serif 4', serif",
                  }}
                >
                  {ticket?.type}
                </Typography>
              </Stack>

              <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                {ticket?.subject}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontFamily: "'Source Serif 4', serif" }}
              >
                Ref: {ticket?.id} · Submitted {ticket?.date}
              </Typography>

              {detail?.description && (
                <Paper
                  variant="outlined"
                  sx={{ mt: 1.5, p: 1.5, bgcolor: "#fafafa", borderRadius: 1.5 }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {detail.description}
                  </Typography>
                </Paper>
              )}

              {!isInquiry && detail?.estimatedCompletion && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Estimated Completion:
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {new Date(detail.estimatedCompletion).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* ── Message thread (Inquiry only) ── */}
            {isInquiry && (
              <>
                <Divider />

                <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    MESSAGE THREAD
                  </Typography>
                </Box>

                {/* Messages list */}
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: 280,
                    minHeight: 120,
                  }}
                >
                  {error && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
                      {error}
                    </Typography>
                  )}

                  {messages.length === 0 && !loading && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", mt: 3 }}
                    >
                      No messages yet. Start the conversation below.
                    </Typography>
                  )}

                  {messages.map((m) => (
                    <MessageBubble key={m.messageId} msg={m} currentUserId={currentUserId} />
                  ))}
                  <div ref={bottomRef} />
                </Box>

                {/* Compose */}
                <Divider />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ p: 1.5, alignItems: "flex-end" }}
                >
                  <TextField
                    multiline
                    maxRows={4}
                    size="small"
                    fullWidth
                    placeholder="Type a message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    sx={{
                      bgcolor: "#1a3a5c",
                      color: "#fff",
                      "&:hover": { bgcolor: "#16324f" },
                      "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
                    }}
                  >
                    {sending ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      <Send fontSize="small" />
                    )}
                  </IconButton>
                </Stack>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
