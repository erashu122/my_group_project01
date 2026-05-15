import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import React, { useState } from "react";
import { addActivity } from "../services/api";

const goalPlans = {
  "Weight Loss": {
    calories: "1800 kcal/day",
    burn: "500 kcal/day",
    activities: ["Running", "Cycling", "HIIT", "Jump Rope"],
    diet: "High protein, low sugar, more water",
  },

  "Muscle Gain": {
    calories: "2800 kcal/day",
    burn: "300 kcal/day",
    activities: [
      "Weight Training",
      "Bench Press",
      "Deadlift",
      "Push Ups",
    ],
    diet: "High protein, healthy carbs, proper sleep",
  },

  "Fat Loss": {
    calories: "2000 kcal/day",
    burn: "450 kcal/day",
    activities: ["Cardio", "Swimming", "Jogging", "Burpees"],
    diet: "Low fat diet with cardio focus",
  },

  "General Fitness": {
    calories: "2200 kcal/day",
    burn: "350 kcal/day",
    activities: ["Yoga", "Walking", "Stretching", "Light Gym"],
    diet: "Balanced healthy diet",
  },
};

const ActivityForm = ({ onActivityAdded }) => {

  const [goal, setGoal] = useState("Weight Loss");

  const [activity, setActivity] = useState({
    activityType: "",
    duration: "",
    caloriesBurned: "",
    intensity: "MEDIUM",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const selectedPlan = goalPlans[goal];

  // 🔥 AUTO CALORIES
  const estimateCalories = () => {

    const base = Number(activity.duration || 0);

    if (!base) return 0;

    if (activity.intensity === "LOW") return base * 4;

    if (activity.intensity === "HIGH") return base * 10;

    return base * 7;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!activity.activityType || !activity.duration) {
      alert("Activity & Duration required");
      return;
    }

    try {

      setLoading(true);

      const payload = {
        activityType: activity.activityType.trim(),
        duration: Number(activity.duration),

        caloriesBurned:
          activity.caloriesBurned
            ? Number(activity.caloriesBurned)
            : estimateCalories(),

        intensity: activity.intensity,
        date: activity.date,
        notes: activity.notes,
      };

      await addActivity(payload);

      if (onActivityAdded) onActivityAdded();

      setActivity({
        activityType: "",
        duration: "",
        caloriesBurned: "",
        intensity: "MEDIUM",
        date: "",
        notes: "",
      });

    } catch (err) {

      console.error(err);

      alert("Error adding activity");

    } finally {

      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg,#0f172a,#020617)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >

      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>

        <FitnessCenterIcon sx={{ mr: 1, color: "#38bdf8" }} />

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Add Activity
        </Typography>

      </Box>

      {/* GOAL SELECTOR */}
      <TextField
        select
        fullWidth
        label="Fitness Goal"
        sx={{ mb: 3 }}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        InputLabelProps={{ style: { color: "#94a3b8" } }}
        InputProps={{ style: { color: "#fff" } }}
      >

        <MenuItem value="Weight Loss">
          Weight Loss
        </MenuItem>

        <MenuItem value="Muscle Gain">
          Muscle Gain
        </MenuItem>

        <MenuItem value="Fat Loss">
          Fat Loss
        </MenuItem>

        <MenuItem value="General Fitness">
          General Fitness
        </MenuItem>

      </TextField>

      {/* AI PLAN */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background:
            "linear-gradient(135deg,#1e3a8a,#0f172a)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >

        <Typography
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "#38bdf8",
          }}
        >
          🤖 AI Suggested Plan
        </Typography>

        <Typography sx={{ mb: 1 }}>
          🔥 Daily Burn Target:
          {" "}
          {selectedPlan.burn}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          🍽 Recommended Calories:
          {" "}
          {selectedPlan.calories}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          🥗 Diet:
          {" "}
          {selectedPlan.diet}
        </Typography>

        <Box sx={{ mt: 2 }}>

          <Typography sx={{ mb: 1 }}>
            🏃 Recommended Activities
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
          >

            {selectedPlan.activities.map((item) => (

              <Chip
                key={item}
                label={item}
                onClick={() =>
                  setActivity({
                    ...activity,
                    activityType: item,
                  })
                }
                sx={{
                  mb: 1,
                  background: "#22c55e",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />

            ))}

          </Stack>

        </Box>

      </Paper>

      {/* FORM */}
      <Box component="form" onSubmit={handleSubmit}>

        {/* TYPE */}
        <TextField
          fullWidth
          label="Activity"
          sx={{ mb: 2 }}
          value={activity.activityType}
          onChange={(e) =>
            setActivity({
              ...activity,
              activityType: e.target.value,
            })
          }
          InputLabelProps={{
            style: { color: "#94a3b8" },
          }}
          InputProps={{
            style: { color: "#fff" },
          }}
        />

        {/* ROW */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2 }}
        >

          <TextField
            fullWidth
            label="Duration (mins)"
            type="number"
            value={activity.duration}
            onChange={(e) =>
              setActivity({
                ...activity,
                duration: e.target.value,
              })
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
            label="Calories"
            type="number"
            value={activity.caloriesBurned}
            onChange={(e) =>
              setActivity({
                ...activity,
                caloriesBurned: e.target.value,
              })
            }
            InputLabelProps={{
              style: { color: "#94a3b8" },
            }}
            InputProps={{
              style: { color: "#fff" },
            }}
          />

        </Stack>

        {/* INTENSITY */}
        <TextField
          select
          fullWidth
          label="Intensity"
          sx={{ mb: 2 }}
          value={activity.intensity}
          onChange={(e) =>
            setActivity({
              ...activity,
              intensity: e.target.value,
            })
          }
          InputLabelProps={{
            style: { color: "#94a3b8" },
          }}
          InputProps={{
            style: { color: "#fff" },
          }}
        >

          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>

        </TextField>

        {/* DATE */}
        <TextField
          fullWidth
          type="date"
          sx={{ mb: 2 }}
          value={activity.date}
          onChange={(e) =>
            setActivity({
              ...activity,
              date: e.target.value,
            })
          }
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              color: "#fff",
            },
          }}
        />

        {/* NOTES */}
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Notes"
          sx={{ mb: 3 }}
          value={activity.notes}
          onChange={(e) =>
            setActivity({
              ...activity,
              notes: e.target.value,
            })
          }
          InputLabelProps={{
            style: { color: "#94a3b8" },
          }}
          InputProps={{
            style: { color: "#fff" },
          }}
        />

        {/* BUTTON */}
        <Button
          type="submit"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 3,
            background:
              "linear-gradient(45deg,#22c55e,#16a34a)",
            color: "#fff",

            "&:hover": {
              background:
                "linear-gradient(45deg,#16a34a,#15803d)",
            },
          }}
        >

          {loading ? "Adding..." : "Add Activity"}

        </Button>

      </Box>

    </Paper>
  );
};

export default ActivityForm;