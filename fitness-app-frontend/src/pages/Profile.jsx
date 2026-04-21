import React, { useState, useEffect } from "react"; // ✅ FIX
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar
} from "@mui/material";

const Profile = ({ keycloak }) => {

  const [edit, setEdit] = useState(false);

  const defaultUser = {
    name: keycloak?.tokenParsed?.preferred_username || "User",
    email: keycloak?.tokenParsed?.email || "",
    age: "",
    weight: "",
    goal: ""
  };

  const [user, setUser] = useState(defaultUser);

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("fitness_profile");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ SAVE DATA
  const handleSave = () => {
    localStorage.setItem("fitness_profile", JSON.stringify(user));
    setEdit(false);
    alert("Profile saved ✅");
  };

  // 🎨 STYLE
  const inputStyle = {
    input: { color: "#fff" },
    label: { color: "#aaa" },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#22c55e"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#555" },
      "&:hover fieldset": { borderColor: "#22c55e" },
      "&.Mui-focused fieldset": { borderColor: "#22c55e" }
    }
  };

  return (
    <Box sx={{ background: "#0f172a", minHeight: "100vh", pb: 5 }}>

      {/* 🔥 HEADER */}
      <Box
        sx={{
          height: 220,
          background: "linear-gradient(135deg, #1e3a8a, #0ea5e9, #22c55e)",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold" }}>
          Your Fitness Profile
        </Typography>
      </Box>

      {/* 🔥 PROFILE CARD */}
      <Paper
        sx={{
          width: "85%",
          mx: "auto",
          mt: -10,
          p: 3,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          background: "rgba(255,255,255,0.08)",
          color: "#fff"
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            fontSize: 36,
            bgcolor: "#22c55e"
          }}
        >
          {user.name?.[0]?.toUpperCase()}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>

          <Typography sx={{ opacity: 0.7 }}>
            {user.email}
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: "#22c55e",
            "&:hover": { background: "#16a34a" }
          }}
          onClick={() => setEdit(!edit)}
        >
          {edit ? "Cancel" : "Edit Profile"}
        </Button>
      </Paper>

      {/* 🔥 FORM */}
      <Paper
        sx={{
          width: "85%",
          mx: "auto",
          mt: 4,
          p: 4,
          borderRadius: 4,
          background: "#111827",
          color: "#fff"
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Personal Details
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={user.name}
              onChange={handleChange}
              disabled={!edit}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              value={user.email}
              disabled
              sx={{
                ...inputStyle,
                input: { color: "#888" }
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Age"
              name="age"
              fullWidth
              value={user.age}
              onChange={handleChange}
              disabled={!edit}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Weight"
              name="weight"
              fullWidth
              value={user.weight}
              onChange={handleChange}
              disabled={!edit}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Goal"
              name="goal"
              fullWidth
              value={user.goal}
              onChange={handleChange}
              disabled={!edit}
              sx={inputStyle}
            />
          </Grid>

        </Grid>

        {edit && (
          <Button
            variant="contained"
            sx={{
              mt: 3,
              background: "#22c55e"
            }}
            onClick={handleSave} // ✅ FIX
          >
            Save Changes
          </Button>
        )}
      </Paper>

    </Box>
  );
};

export default Profile;