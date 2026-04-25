import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  AdminPanelSettingsOutlined as ManageAdminsIcon,
  PeopleOutline as StudentsIcon,
  ListAltOutlined as AllTicketsIcon,
  HistoryOutlined as LogIcon,
  TuneOutlined as SystemIcon,
  NotificationsOutlined as BellIcon,
  PersonOutline as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  ShieldOutlined as ShieldIcon,
  MenuOutlined as HamburgerIcon,
} from "@mui/icons-material";

const NAV_LINKS = [
  { to: "/superadmin/dashboard",     label: "Dashboard",      icon: <DashboardIcon fontSize="small" /> },
  { to: "/superadmin/manage-admins", label: "Manage admins",  icon: <ManageAdminsIcon fontSize="small" /> },
  { to: "/superadmin/students",      label: "Students",       icon: <StudentsIcon fontSize="small" /> },
  { to: "/superadmin/all-tickets",   label: "All tickets",    icon: <AllTicketsIcon fontSize="small" /> },
  { to: "/superadmin/activity-log",  label: "Activity log",   icon: <LogIcon fontSize="small" /> },
  { to: "/superadmin/system",        label: "System",         icon: <SystemIcon fontSize="small" /> },
];

const NOTIFICATIONS = [
  { id: 1, text: "New admin account request pending approval.", time: "10m ago", unread: true },
  { id: 2, text: "System usage exceeded 80% threshold.",        time: "1h ago",  unread: true },
  { id: 3, text: "Weekly system report is ready.",              time: "1d ago",  unread: false },
];

// Super Admin accent — deep indigo/violet
const ACCENT       = "#4338ca";
const ACCENT_LIGHT = "#eef2ff";
const ACCENT_MID   = "#c7d2fe";

export default function SuperAdminNavbar({
  user = { name: "Super Admin", initials: "SA", dept: "System Management" },
}) {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor,   setNotifAnchor]   = useState(null);
  const [mobileOpen,   setMobileOpen]    = useState(false);

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
      <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: "56px !important", gap: 0.5 }}>

        {/* ── Brand ── */}
        <Box
          component="a"
          href="/superadmin/dashboard"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", mr: 1.5, flexShrink: 0 }}
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
            <Box component="span" sx={{ color: ACCENT }}>Ticket</Box> Ease
          </Typography>
        </Box>

        {/* Super Admin role pill */}
        <Chip
          icon={<ShieldIcon sx={{ fontSize: "12px !important", color: `${ACCENT} !important` }} />}
          label="Super admin"
          size="small"
          sx={{
            height: 20,
            fontSize: 10.5,
            fontWeight: 700,
            bgcolor: ACCENT_LIGHT,
            color: ACCENT,
            border: "1px solid",
            borderColor: ACCENT_MID,
            "& .MuiChip-label": { px: 0.75, pl: 0.25 },
            mr: 1.5,
            flexShrink: 0,
          }}
        />

        {/* ── Divider ── */}
        <Divider orientation="vertical" flexItem sx={{ mr: 1.5, borderColor: "grey.200", display: { xs: "none", md: "block" } }} />

        {/* ── Nav Links (desktop) ── */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
        {NAV_LINKS.map(({ to, label, icon }) => (
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
              </Box>
            )}
          </NavLink>
        ))}
        </Box>

        {/* ── Right side ── */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>

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
                sx={{ "& .MuiBadge-badge": { fontSize: 9, minWidth: 16, height: 16 } }}
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
                bgcolor: ACCENT_MID,
                color: ACCENT,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: "8px",
              }}
            >
              {user.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled", lineHeight: 1.2 }}>
                {user.dept}
              </Typography>
            </Box>
          </Box>

          {/* Avatar only (mobile) */}
          <Avatar
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              display: { xs: "flex", md: "none" },
              width: 28,
              height: 28,
              bgcolor: ACCENT_MID,
              color: ACCENT,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              ml: 0.5,
            }}
          >
            {user.initials}
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
          sx: { mt: 1, borderRadius: "12px", border: "1px solid", borderColor: "grey.200", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", width: 300 },
        }}
      >
        <Typography sx={{ px: 2, pt: 1.5, pb: 0.75, fontSize: 11, fontWeight: 700, color: "text.disabled", letterSpacing: "0.6px", textTransform: "uppercase" }}>
          Notifications
        </Typography>
        <List disablePadding>
          {NOTIFICATIONS.map((n, i) => (
            <ListItem
              key={n.id}
              disablePadding
              sx={{ borderTop: i > 0 ? "1px solid" : "none", borderColor: "grey.100" }}
            >
              <ListItemButton sx={{ px: 2, py: 1.25, alignItems: "flex-start", gap: 1, bgcolor: n.unread ? "#f5f3ff" : "transparent" }}>
                {n.unread && (
                  <Box sx={{ width: 6, height: 6, bgcolor: ACCENT, borderRadius: "50%", mt: 0.75, flexShrink: 0 }} />
                )}
                <Box sx={{ ml: n.unread ? 0 : "14px" }}>
                  <Typography sx={{ fontSize: 12.5, color: "text.primary", lineHeight: 1.4 }}>{n.text}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}>{n.time}</Typography>
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
          sx: { mt: 1, borderRadius: "12px", border: "1px solid", borderColor: "grey.200", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", minWidth: 220 },
        }}
      >
        <Box sx={{ px: 2, pt: 1.75, pb: 1.25, borderBottom: "1px solid", borderColor: "grey.100" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{user.name}</Typography>
            <Chip
              label="Super admin"
              size="small"
              sx={{
                height: 16,
                fontSize: 9.5,
                fontWeight: 700,
                bgcolor: ACCENT_LIGHT,
                color: ACCENT,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{user.dept}</Typography>
        </Box>
        <MenuItem onClick={() => { navigate("/superadmin/profile"); setProfileAnchor(null); }} sx={{ py: 1.125 }}>
          <ListItemIcon sx={{ minWidth: "auto", mr: 1.25 }}><ProfileIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5 }}>View profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate("/superadmin/system"); setProfileAnchor(null); }} sx={{ py: 1.125 }}>
          <ListItemIcon sx={{ minWidth: "auto", mr: 1.25 }}><SystemIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5 }}>System settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate("/superadmin/activity-log"); setProfileAnchor(null); }} sx={{ py: 1.125 }}>
          <ListItemIcon sx={{ minWidth: "auto", mr: 1.25 }}><LogIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5 }}>Activity log</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { navigate("/logout"); setProfileAnchor(null); }} sx={{ py: 1.125, color: "error.main" }}>
          <ListItemIcon sx={{ minWidth: "auto", mr: 1.25 }}><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13.5, color: "error.main" }}>Sign out</ListItemText>
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
        {NAV_LINKS.map(({ to, label, icon }) => (
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
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ my: 0.5 }} />

      {/* Profile actions */}
      <List sx={{ px: 1 }}>
        <ListItemButton sx={{ borderRadius: "8px", mb: 0.25 }} onClick={() => { navigate("/superadmin/profile"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><ProfileIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>View profile</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: "8px", mb: 0.25 }} onClick={() => { navigate("/superadmin/system"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><SystemIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>System settings</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: "8px", color: "error.main" }} onClick={() => { navigate("/logout"); setMobileOpen(false); }}>
          <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, color: "error.main" }}>Sign out</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
    </>
  );
}
