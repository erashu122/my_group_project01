import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/users/register", form); // ✅ FIXED

      alert("Signup successful");
      navigate("/");

    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        mx: "auto",
        mt: 5
      }}
    >
      <TextField
        label="First Name"
        value={form.firstname}
        onChange={(e) =>
          setForm({ ...form, firstname: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        label="Last Name"
        value={form.lastname}
        onChange={(e) =>
          setForm({ ...form, lastname: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained">
        Signup
      </Button>
    </Box>
  );
};

export default Signup;