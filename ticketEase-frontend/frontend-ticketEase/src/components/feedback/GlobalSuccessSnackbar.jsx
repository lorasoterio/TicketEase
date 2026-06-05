import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const SUCCESS_ACTION_EVENT = "app:success-action";
const AUTO_HIDE_DURATION_MS = 3000;

export default function GlobalSuccessSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleSuccessAction = (event) => {
      const nextMessage = event?.detail?.message;
      setMessage(typeof nextMessage === "string" && nextMessage.trim() ? nextMessage : "Action completed successfully.");
      setOpen(true);
    };

    window.addEventListener(SUCCESS_ACTION_EVENT, handleSuccessAction);
    return () => {
      window.removeEventListener(SUCCESS_ACTION_EVENT, handleSuccessAction);
    };
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={AUTO_HIDE_DURATION_MS}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
