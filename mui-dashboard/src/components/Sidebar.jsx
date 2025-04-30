import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  Dashboard,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

import logo from "../assets/hero.png";

import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

export default function Sidebar() {

  return (
    <Box
      width={260}
      height="100vh"
      bgcolor="#faf8ff"
      sx={{
        paddingTop: 2,
      }}
      display="flex"
      flexDirection="column"
      position="fixed"
    >
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pl: 3,
          pb: 2,
          fontWeight: "bold",
          fontSize: "1.4rem",
          color: "#915eff",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <img
          src={logo}
          alt="CampusCareer Logo"
          style={{ width: 40, height: 40 }}
        />
        CampusCareer
      </Typography>

      <List component="nav">
        {/* Dashboard with badge */}
        <ListItemButton
          sx={{
            mx: 2,
            borderRadius: 2,
            backgroundColor: "#f0ecfe",
            color: "#915eff",
            "&:hover": {
              backgroundColor: "#ebe6fd",
            },
          }}
        >
          <ListItemIcon
            sx={{ color: "#915eff", minWidth: "auto", pl: 1, pr: 2 }}
          >
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboards" />
        </ListItemButton>

        {/* Billing */}
        <ListItemButton sx={{ mx: 2, mt: 1, borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: "auto", pl: 1, pr: 2 }}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Assessment" />
        </ListItemButton>

        {/* Connection with 'PRO' chip */}
        <ListItemButton
          component="a"
          href="http://127.0.0.1:5000/communication"
          sx={{ mx: 2, mt: 1, borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: "auto", pl: 1, pr: 2 }}>
            <HeadsetMicIcon />
          </ListItemIcon>
          <ListItemText primary="Communication" />
        </ListItemButton>
      </List>
    </Box>
  );
}
