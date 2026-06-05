import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";

// ─── Icons (inline SVG to avoid extra deps) ────────────────────────────────
const icons = {
  delete: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="12" y1="8" x2="12" y2="8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Variant config ────────────────────────────────────────────────────────
const variantConfig = {
  danger: {
    iconColor: "#D32F2F",
    iconBg: "#FEECEC",
    confirmColor: "error",
    confirmVariant: "contained",
  },
  warning: {
    iconColor: "#E65100",
    iconBg: "#FFF3E0",
    confirmColor: "warning",
    confirmVariant: "contained",
  },
  info: {
    iconColor: "#0277BD",
    iconBg: "#E1F5FE",
    confirmColor: "primary",
    confirmVariant: "contained",
  },
  success: {
    iconColor: "#2E7D32",
    iconBg: "#E8F5E9",
    confirmColor: "success",
    confirmVariant: "contained",
  },
};

// ─── Slide transition ──────────────────────────────────────────────────────
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ─── Context ───────────────────────────────────────────────────────────────
const ConfirmContext = createContext(null);

/**
 * ConfirmProvider
 * Wrap your app (or a subtree) with this. Then call useConfirm() anywhere below.
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false });
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: options.title ?? "Are you sure?",
        description: options.description ?? "",
        confirmLabel: options.confirmLabel ?? "Confirm",
        cancelLabel: options.cancelLabel ?? "Cancel",
        variant: options.variant ?? "info",
        icon: options.icon ?? null,
        hideCancelButton: options.hideCancelButton ?? false,
      });
    });
  }, []);

  const handleClose = useCallback((result) => {
    setState((s) => ({ ...s, open: false }));
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog state={state} onClose={handleClose} />
    </ConfirmContext.Provider>
  );
}

/**
 * useConfirm()
 * Returns a `confirm(options)` function that returns a Promise<boolean>.
 *
 * Options:
 *   title          – Dialog heading
 *   description    – Supporting text
 *   confirmLabel   – Confirm button label (default: "Confirm")
 *   cancelLabel    – Cancel button label (default: "Cancel")
 *   variant        – "danger" | "warning" | "info" | "success"
 *   icon           – "delete" | "warning" | "info" | "success" | ReactNode
 *   hideCancelButton – hide the cancel button (default: false)
 */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
}

// ─── The actual dialog ─────────────────────────────────────────────────────
function ConfirmDialog({ state, onClose }) {
  const {
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    variant = "info",
    icon,
    hideCancelButton,
  } = state;

  const cfg = variantConfig[variant] ?? variantConfig.info;
  const resolvedIcon =
    icon === null
      ? icons[variant] ?? icons.info
      : typeof icon === "string"
      ? icons[icon] ?? icons.info
      : icon;

  return (
    <Dialog
      open={!!open}
      onClose={() => onClose(false)}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 4,
        sx: {
          borderRadius: 3,
          p: 0.5,
        },
      }}
    >
      {/* Close button */}
      <IconButton
        size="small"
        onClick={() => onClose(false)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover" },
        }}
        aria-label="close dialog"
      >
        {icons.close}
      </IconButton>

      <DialogTitle sx={{ pt: 3, pb: 1, pr: 5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          {/* Icon badge */}
          <Box
            sx={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: cfg.iconBg,
              color: cfg.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 0.25,
            }}
            aria-hidden="true"
          >
            {resolvedIcon}
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              lineHeight={1.3}
              sx={{ color: "text.primary" }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.6 }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1 }}>
        {!hideCancelButton && (
          <Button
            onClick={() => onClose(false)}
            variant="outlined"
            color="inherit"
            sx={{
              flex: 1,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.secondary" },
            }}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          onClick={() => onClose(true)}
          variant={cfg.confirmVariant}
          color={cfg.confirmColor}
          autoFocus
          sx={{ flex: 1 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;