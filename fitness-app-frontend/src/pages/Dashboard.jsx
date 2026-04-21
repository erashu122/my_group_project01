import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper
} from "@mui/material";

import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import DashboardCharts from "../components/DashboardCharts";
import AIChat from "../components/AIChat";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(0);

  const reload = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">

        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            💪 FITNET Dashboard
          </Typography>

          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            AI-powered fitness tracking
          </Typography>
        </Box>

        {/* CHART */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            mb: 3,
          }}
        >
          <DashboardCharts />
        </Paper>

        {/* GRID */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
              }}
            >
              <ActivityForm onActivityAdded={reload} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
              }}
            >
              <ActivityList refreshTrigger={refresh} />
            </Paper>
          </Grid>
        </Grid>

        <AIChat />

      </Container>
    </Box>
  );
};

export default Dashboard;