import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/register", form);
      alert("Signup successful");
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      alert("Signup failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSignup} sx={{ display: "flex", flexDirection: "column", width: 300, mx: "auto", mt: 5 }}>
      <TextField label="First Name" name="firstname" value={form.firstname} onChange={(e)=>setForm({...form, firstname:e.target.value})} sx={{ mb: 2 }} />
      <TextField label="Last Name" name="lastname" value={form.lastname} onChange={(e)=>setForm({...form, lastname:e.target.value})} sx={{ mb: 2 }} />
      <TextField label="Email" name="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} sx={{ mb: 2 }} />
      <TextField label="Password" name="password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} sx={{ mb: 2 }} />
      <Button type="submit" variant="contained">Signup</Button>
    </Box>
  );
};

export default Signup;