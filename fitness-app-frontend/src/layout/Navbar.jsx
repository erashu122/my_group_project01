import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar({ keycloak }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // ✅ Safe user data
  const username =
    keycloak?.tokenParsed?.preferred_username || "User";

  const email =
    keycloak?.tokenParsed?.email || "No Email";

  // ✅ Menu handlers
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ✅ Logout
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  // ✅ Navigate properly (NO new tab)
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  return (
    <AppBar position="sticky" sx={{ background: "#0f172a" }}>
      <Toolbar>

        {/* 🔥 App Title */}
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
          💪 FITNET
        </Typography>

        {/* 🔐 Avatar */}
        <IconButton onClick={handleMenuOpen}>
          <Avatar sx={{ bgcolor: "#22c55e" }}>
            {username[0]?.toUpperCase()}
          </Avatar>
        </IconButton>

        {/* 📂 Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>{email}</MenuItem>

          <MenuItem onClick={handleProfile}>
            Profile
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;