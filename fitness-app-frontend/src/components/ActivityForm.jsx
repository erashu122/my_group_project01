import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import React, { useState } from "react";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    activityType: "",
    duration: "",
    caloriesBurned: "",
    intensity: "MEDIUM",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 SIMPLE CALORIE ESTIMATE (fallback)
  const estimateCalories = () => {
    const base = Number(activity.duration || 0);
    if (!base) return 0;

    if (activity.intensity === "LOW") return base * 4;
    if (activity.intensity === "HIGH") return base * 10;

    return base * 7; // MEDIUM
  };

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
            : estimateCalories(), // 🔥 auto calc
        intensity: activity.intensity,
        date: activity.date,
        notes: activity.notes,
      };

      console.log("📤 Sending:", payload);

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
        background: "linear-gradient(135deg,#1e293b,#020617)",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FitnessCenterIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Add Activity
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>

        {/* TYPE */}
        <TextField
          fullWidth
          label="Activity (Gym, Football, Yoga...)"
          sx={{ mb: 2 }}
          value={activity.activityType}
          onChange={(e) =>
            setActivity({ ...activity, activityType: e.target.value })
          }
          InputLabelProps={{ style: { color: "#94a3b8" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        {/* ROW */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>

          <TextField
            fullWidth
            label="Duration (mins)"
            type="number"
            value={activity.duration}
            onChange={(e) =>
              setActivity({ ...activity, duration: e.target.value })
            }
            InputLabelProps={{ style: { color: "#94a3b8" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <TextField
            fullWidth
            label="Calories (optional)"
            type="number"
            value={activity.caloriesBurned}
            onChange={(e) =>
              setActivity({
                ...activity,
                caloriesBurned: e.target.value,
              })
            }
            InputLabelProps={{ style: { color: "#94a3b8" } }}
            InputProps={{ style: { color: "#fff" } }}
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
            setActivity({ ...activity, intensity: e.target.value })
          }
          InputLabelProps={{ style: { color: "#94a3b8" } }}
          InputProps={{ style: { color: "#fff" } }}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>

        {/* DATE */}
        <TextField
          fullWidth
          type="datetime-local"
          sx={{ mb: 2 }}
          value={activity.date}
          onChange={(e) =>
            setActivity({ ...activity, date: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { color: "#fff" } }}
        />

        {/* NOTES */}
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Notes (optional)"
          sx={{ mb: 3 }}
          value={activity.notes}
          onChange={(e) =>
            setActivity({ ...activity, notes: e.target.value })
          }
          InputLabelProps={{ style: { color: "#94a3b8" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        {/* BUTTON */}
        <Button
          type="submit"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            background:
              "linear-gradient(45deg,#22c55e,#16a34a)",
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