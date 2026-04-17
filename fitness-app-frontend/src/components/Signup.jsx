import { useState } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/register", form);
      alert("Signup successful");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 4, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
            Create Your Account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign up and start tracking your fitness journey.
          </Typography>

          <Box component="form" onSubmit={handleSignup}>
            <Stack spacing={2}>
              <TextField
                label="First Name"
                name="firstname"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                required
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <Button type="submit" variant="contained" size="large">
                Sign Up
              </Button>
              <Button variant="text" onClick={() => navigate("/")}>
                Back to Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
