import React from "react";
import { Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App({ keycloak }) {

  // 🔥 DIRECT CHECK (NO STATE BUG)
  if (!keycloak?.authenticated) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar keycloak={keycloak} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile keycloak={keycloak} />} />
      </Routes>
      
      <SpeedInsights />
    </>
  );
}

export default App;