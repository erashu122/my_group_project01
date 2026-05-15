import React, { useState, useEffect } from "react";

import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material";

import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import DashboardCharts from "../components/DashboardCharts";
import AIChat from "../components/AIChat";

import { getPredictionReport } from "../services/api";

const Dashboard = () => {

  const [refresh, setRefresh] = useState(0);

  const [prediction, setPrediction] = useState("");

  // =========================
  // BMI STATES
  // =========================
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [bmi, setBmi] = useState(null);

  const [bmiStatus, setBmiStatus] = useState("");

  // =========================
  // STREAK
  // =========================
  const streakDays = 7;

  // =========================
  // BADGES
  // =========================
  const badges = [
    "🏅 Fat Burner",
    "🏅 Consistency Master",
    "🏅 AI Fitness Explorer",
  ];

  const reload = () => {
    setRefresh((prev) => prev + 1);
  };

  // =========================
  // LOAD AI PREDICTION
  // =========================
  useEffect(() => {

    const fetchPrediction = async () => {

      try {

        const res = await getPredictionReport();

        setPrediction(res.data);

      } catch (err) {

        console.error(err);

        setPrediction("Unable to load AI Prediction");
      }
    };

    fetchPrediction();

  }, []);

  // =========================
  // BMI CALCULATOR
  // =========================
  const calculateBMI = () => {

    if (!weight || !height) {
      alert("Enter weight and height");
      return;
    }

    const heightInMeters = Number(height) / 100;

    const bmiValue =
      Number(weight) /
      (heightInMeters * heightInMeters);

    const finalBMI = bmiValue.toFixed(1);

    setBmi(finalBMI);

    if (finalBMI < 18.5) {
      setBmiStatus("Underweight");
    } else if (finalBMI < 25) {
      setBmiStatus("Normal Weight");
    } else if (finalBMI < 30) {
      setBmiStatus("Overweight");
    } else {
      setBmiStatus("Obese");
    }
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
            sx={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            💪 FITNET Dashboard
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              mt: 1,
            }}
          >
            AI-powered fitness tracking
          </Typography>

        </Box>

        {/* AI PREDICTION CARD */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #1e3a8a, #0f172a)",
            color: "#fff",
            mb: 3,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#38bdf8",
            }}
          >
            🤖 AI Fitness Prediction Report
          </Typography>

          <Divider
            sx={{
              background: "rgba(255,255,255,0.2)",
              mb: 2,
            }}
          />

          <Typography
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 2,
              color: "#e2e8f0",
              fontSize: "1rem",
            }}
          >
            {prediction}
          </Typography>

        </Paper>

        {/* BMI + STREAK + BADGES */}
        <Grid container spacing={3} sx={{ mb: 3 }}>

          {/* BMI */}
          <Grid item xs={12} md={4}>

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg,#0f172a,#111827)",
                color: "#fff",
                height: "100%",
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                ⚖ BMI Calculator
              </Typography>

              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                sx={{ mb: 2 }}
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                InputLabelProps={{
                  style: { color: "#94a3b8" },
                }}
                InputProps={{
                  style: { color: "#fff" },
                }}
              />

              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                sx={{ mb: 2 }}
                value={height}
                onChange={(e) =>
                  setHeight(e.target.value)
                }
                InputLabelProps={{
                  style: { color: "#94a3b8" },
                }}
                InputProps={{
                  style: { color: "#fff" },
                }}
              />

              <Button
                fullWidth
                onClick={calculateBMI}
                sx={{
                  mb: 2,
                  background:
                    "linear-gradient(45deg,#22c55e,#16a34a)",
                  color: "#fff",

                  "&:hover": {
                    background:
                      "linear-gradient(45deg,#16a34a,#15803d)",
                  },
                }}
              >
                Calculate BMI
              </Button>

              {bmi && (

                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "rgba(255,255,255,0.05)",
                  }}
                >

                  <Typography>
                    BMI:
                    {" "}
                    <strong>{bmi}</strong>
                  </Typography>

                  <Typography>
                    Status:
                    {" "}
                    <strong>{bmiStatus}</strong>
                  </Typography>

                </Paper>

              )}

            </Paper>

          </Grid>

          {/* STREAK */}
          <Grid item xs={12} md={4}>

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg,#7c3aed,#4c1d95)",
                color: "#fff",
                height: "100%",
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                🔥 Workout Streak
              </Typography>

              <Typography
                variant="h2"
                fontWeight="bold"
              >
                {streakDays}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Days Active
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  color: "#ddd6fe",
                }}
              >
                Amazing consistency! Keep pushing 💪
              </Typography>

            </Paper>

          </Grid>

          {/* BADGES */}
          <Grid item xs={12} md={4}>

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg,#ea580c,#9a3412)",
                color: "#fff",
                height: "100%",
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                🏆 Achievement Badges
              </Typography>

              <Stack spacing={2}>

                {badges.map((badge) => (

                  <Chip
                    key={badge}
                    label={badge}
                    sx={{
                      background:
                        "rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                    }}
                  />

                ))}

              </Stack>

            </Paper>

          </Grid>

        </Grid>

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
                background:
                  "rgba(255,255,255,0.05)",
                color: "#fff",
              }}
            >
              <ActivityForm
                onActivityAdded={reload}
              />
            </Paper>

          </Grid>

          <Grid item xs={12} md={8}>

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "rgba(255,255,255,0.05)",
                color: "#fff",
              }}
            >
              <ActivityList
                refreshTrigger={refresh}
              />
            </Paper>

          </Grid>

        </Grid>

        <AIChat />

      </Container>
    </Box>
  );
};

export default Dashboard;