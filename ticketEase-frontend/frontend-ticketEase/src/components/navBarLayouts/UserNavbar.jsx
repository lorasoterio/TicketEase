import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Chip,
  ListItemIcon,
  ListItemText,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Drawer,
} from "@mui/material";
import {
  ConfirmationNumber as TicketIcon,
  DashboardOutlined as DashboardIcon,
  AddCircleOutline as SubmitIcon,
  TrackChangesOutlined as TrackIcon,
  ChatBubbleOutline as MessageIcon,
  NotificationsOutlined as BellIcon,
  PersonOutline as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  FiberManualRecord as DotIcon,
  MenuOutlined as HamburgerIcon,
} from "@mui/icons-material";

const NAV_LINKS = [
  {
    to: "/user/dashboard",
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    to: "/user/my-tickets",
    label: "My tickets",
    icon: <TicketIcon fontSize="small" />,
    ticketBadge: true,
  },
  {
    to: "/user/track-status",
    label: "Track status",
    icon: <TrackIcon fontSize="small" />,
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Your ticket #1042 has been updated by staff.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    text: "Staff replied on ticket #1055.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    text: "Ticket #0991 was marked as completed.",
    time: "2d ago",
    unread: false,
  },
];

// Shared accent for student role
const ACCENT = "#1a56e8";
const ACCENT_LIGHT = "#eef3fd";

export default function UserNavbar() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const fullName = profile?.fullName || "Student";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;
    client.get("/tickets")
      .then(({ data }) => setTicketCount(data.length))
      .catch(() => setTicketCount(null));
  }, [user]);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <>
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid",
        borderColor: "grey.100",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{ px: { xs: 2, md: 3 }, minHeight: "56px !important", gap: 0.5 }}
      >
        {/* ── Brand ── */}
        <Box
          component="a"
          href="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            mr: 2,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              bgcolor: ACCENT,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TicketIcon sx={{ fontSize: 16, color: "#fff" }} />
          </Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.3px",
              color: "text.primary",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Box component="span" sx={{ color: ACCENT }}>
              Ticket
            </Box>{" "}
            Ease
          </Typography>
        </Box>

        {/* ── Divider ── */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1.5, borderColor: "grey.200", display: { xs: "none", md: "block" } }}
        />

        {/* ── Nav Links (desktop) ── */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
        {NAV_LINKS.map(({ to, label, icon, badge, ticketBadge, dot }) => (
          <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.25,
                  py: 0.75,
                  borderRadius: "8px",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 450,
                  fontFamily: "'DM Sans', sans-serif",
                  color: isActive ? ACCENT : "text.secondary",
                  bgcolor: isActive ? ACCENT_LIGHT : "transparent",
                  position: "relative",
                  transition: "all 0.12s",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  "& svg": { color: isActive ? ACCENT : "text.disabled" },
                  "&:hover": {
                    bgcolor: isActive ? ACCENT_LIGHT : "grey.50",
                    color: isActive ? ACCENT : "text.primary",
                  },
                }}
              >
                {icon}
                {label}
                {(ticketBadge ? ticketCount : badge) != null && (ticketBadge ? ticketCount : badge) > 0 && (
                  <Chip
                    label={ticketBadge ? ticketCount : badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      ml: 0.25,
                      bgcolor: isActive ? ACCENT : ACCENT_LIGHT,
                      color: isActive ? "#fff" : ACCENT,
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                )}
                {dot && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: "error.main",
                      borderRadius: "50%",
                      position: "absolute",
                      top: 5,
                      right: 4,
                    }}
                  />
                )}
              </Box>
            )}
          </NavLink>
        ))}
        </Box>

        {/* ── Right side ── */}
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {/* Notification bell */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              sx={{ borderRadius: "8px", width: 34, height: 34 }}
            >
              <Badge
                badgeContent={unread}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 9,
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <BellIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile button (desktop only) */}
          <Box
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              pl: 0.5,
              pr: 1,
              py: 0.5,
              borderRadius: "10px",
              cursor: "pointer",
              border: "1px solid transparent",
              ml: 0.5,
              transition: "all 0.12s",
              "&:hover": { bgcolor: "grey.50", borderColor: "grey.200" },
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: ACCENT_LIGHT,
                color: ACCENT,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: "8px",
              }}
            >
              {initials}
            </Avatar>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.2,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {fullName}
            </Typography>
          </Box>

          {/* Avatar only (mobile) */}
          <Avatar
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              display: { xs: "flex", md: "none" },
              width: 28,
              height: 28,
              bgcolor: ACCENT_LIGHT,
              color: ACCENT,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              ml: 0.5,
            }}
          >
            {initials}
          </Avatar>

          {/* Hamburger (mobile only) */}
          <IconButton
            size="small"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "flex", md: "none" }, borderRadius: "8px", width: 34, height: 34 }}
          >
            <HamburgerIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* ── Notifications Popover ── */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            width: 300,
          },
        }}
      >
        <Typography
          sx={{
            px: 2,
            pt: 1.5,
            pb: 0.75,
            fontSize: 11,
            fontWeight: 700,
            color: "text.disabled",
            letterSpacing: "0.6px",
            textTransform: "uppercase",
          }}
        >
          Notifications
        </Typography>
        <List disablePadding>
          {NOTIFICATIONS.map((n, i) => (
            <ListItem
              key={n.id}
              disablePadding
              sx={{
                borderTop: i > 0 ? "1px solid" : "none",
                borderColor: "grey.100",
              }}
            >
              <ListItemButton
                sx={{
                  px: 2,
                  py: 1.25,
                  alignItems: "flex-start",
                  gap: 1,
                  bgcolor: n.unread ? "#fafbff" : "transparent",
                }}
              >
                {n.unread && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: ACCENT,
                      borderRadius: "50%",
                      mt: 0.75,
                      flexShrink: 0,
                    }}
                  />
                )}
                <Box sx={{ ml: n.unread ? 0 : "14px" }}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "text.primary",
                      lineHeight: 1.4,
                    }}
                  >
                    {n.text}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}
                  >
                    {n.time}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* ── Profile Menu ── */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            minWidth: 220,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 1.75,
            pb: 1.25,
            borderBottom: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
            {fullName}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            navigate("/user/profile");
            setProfileAnchor(null);
          }}
          sx={{ gap: 1.25, py: 1.125, fontSize: 13.5 }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5 }}>
            View profile
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/settings");
            setProfileAnchor(null);
          }}
          sx={{ gap: 1.25, py: 1.125 }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5 }}>
            Settings
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        
        <MenuItem
          onClick={async () => {
            setProfileAnchor(null);
            //await supabase.auth.signOut();
            navigate("/login");
          }}
          sx={{ gap: 1.25, py: 1.125, color: "error.main" }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: 13.5, color: "error.main" }}
          >
            Sign out
          </ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>

    {/* ── Mobile Drawer ── */}
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      PaperProps={{ sx: { width: 260 } }}
    >
      {/* Drawer header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.100", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 30, height: 30, bgcolor: ACCENT, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TicketIcon sx={{ fontSize: 16, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px", color: "text.primary", fontFamily: "'DM Sans', sans-serif" }}>
          <Box component="span" sx={{ color: ACCENT }}>Ticket</Box> Ease
        </Typography>
      </Box>

      {/* Nav links */}
      <List sx={{ pt: 1, px: 1 }}>
        {NAV_LINKS.map(({ to, label, icon, badge, ticketBadge, dot }) => (
          <NavLink key={to} to={to} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  mb: 0.25,
                  bgcolor: isActive ? ACCENT_LIGHT : "transparent",
                  color: isActive ? ACCENT : "text.secondary",
                  "& svg": { color: isActive ? ACCENT : "text.disabled" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 450, fontFamily: "'DM Sans', sans-serif" }}>
                  {label}
                </ListItemText>
                {(ticketBadge ? ticketCount : badge) != null && (ticketBadge ? ticketCount : badge) > 0 && (
                  <Chip label={ticketBadge ? ticketCount : badge} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: isActive ? ACCENT : ACCENT_LIGHT, color: isActive ? "#fff" : ACCENT, "& .MuiChip-label": { px: 0.75 } }} />
                )}
                {dot && <Box sx={{ width: 6, height: 6, bgcolor: "error.main", borderRadius: "50%" }} />}
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ my: 0.5 }} />

      {/* Profile actions */}
      <List sx={{ px: 1 }}>
        <ListItemButton sx={{ borderRadius: "8px", mb: 0.25 }} onClick={() => { navigate("/user/profile"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><ProfileIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>View profile</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: "8px", mb: 0.25 }} onClick={() => { navigate("/settings"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Settings</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: "8px", color: "error.main" }} onClick={() => { navigate("/login"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, color: "error.main" }}>Sign out</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
    </>
  );
}
