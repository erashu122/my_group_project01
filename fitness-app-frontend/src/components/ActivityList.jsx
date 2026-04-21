import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Stack,
  Box,
  IconButton,
  CircularProgress
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TimerIcon from "@mui/icons-material/Timer";
import CloseIcon from "@mui/icons-material/Close";

import React, { useEffect, useState } from "react";
import {
  getActivities,
  getAIRecommendation,
  generateReport,
} from "../services/api";

const ActivityList = ({ refreshTrigger }) => {

  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // 🔥 FETCH ACTIVITIES
  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(res.data);
    } catch (err) {
      console.error("Activity load error", err);
    }
  };

  // 🔥 AI HANDLER (FINAL FIXED)
  const handleAI = async (activity) => {
    try {
      setLoadingAI(true);
      setOpen(true);

      const res = await getAIRecommendation({
        id: activity.id,
        userId: activity.userId,
        type: activity.activityType,
        duration: activity.duration,
        caloriesBurned: activity.caloriesBurned,
      });

      const data = res.data;

      // ✅ BACKEND STRUCTURE MATCH
      setAiData({
        overview: data.recommendation,
        tips: data.improvements || [],
        avoid: data.safety || [],
        diet: data.suggestions || [],
      });

    } catch (err) {
      console.error("AI ERROR:", err);

      setAiData({
        overview: "AI failed. Try again.",
        tips: [],
        avoid: [],
        diet: [],
      });

    } finally {
      setLoadingAI(false);
    }
  };

  // 🔥 PDF DOWNLOAD
  const downloadPDF = async () => {
    try {
      const res = await generateReport(JSON.stringify(aiData));

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "fitness-report.pdf");

      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error("PDF error", err);
    }
  };

  return (
    <>
      {/* 🔥 ACTIVITY CARDS */}
      <Grid container spacing={3}>
        {activities.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <Card
              sx={{
                borderRadius: 4,
                background: "linear-gradient(135deg,#0f172a,#020617)",
                color: "#fff",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>

                  {/* TITLE */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <FitnessCenterIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {a.activityType}
                    </Typography>
                  </Box>

                  {/* STATS */}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<TimerIcon />}
                      label={`${a.duration} mins`}
                      sx={{ bgcolor: "#1e293b", color: "#fff" }}
                    />
                    <Chip
                      icon={<LocalFireDepartmentIcon />}
                      label={`${a.caloriesBurned} kcal`}
                      sx={{ bgcolor: "#7f1d1d", color: "#fff" }}
                    />
                  </Stack>

                  {/* BUTTON */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background:
                        "linear-gradient(45deg,#22c55e,#16a34a)",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleAI(a)}
                  >
                    Get AI Advice
                  </Button>

                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 AI MODAL */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg,#020617,#0f172a)",
            color: "#fff",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          🤖 AI Fitness Coach
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent>

          {loadingAI ? (
            <Box textAlign="center" py={5}>
              <CircularProgress />
              <Typography mt={2}>Analyzing...</Typography>
            </Box>
          ) : (
            aiData && (
              <Stack spacing={3}>

                {/* OVERVIEW */}
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#1e3a8a" }}>
                  <Typography fontWeight="bold">Overview</Typography>
                  <Typography>{aiData.overview}</Typography>
                </Box>

                {/* TIPS */}
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#166534" }}>
                  <Typography fontWeight="bold">What to Do</Typography>
                  {aiData.tips?.map((t, i) => (
                    <Typography key={i}>• {t}</Typography>
                  ))}
                </Box>

                {/* AVOID */}
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#7f1d1d" }}>
                  <Typography fontWeight="bold">Avoid</Typography>
                  {aiData.avoid?.map((t, i) => (
                    <Typography key={i}>• {t}</Typography>
                  ))}
                </Box>

                {/* DIET */}
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#92400e" }}>
                  <Typography fontWeight="bold">Diet Tips</Typography>
                  {aiData.diet?.map((t, i) => (
                    <Typography key={i}>• {t}</Typography>
                  ))}
                </Box>

                {/* DOWNLOAD */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(45deg,#6366f1,#4f46e5)",
                    fontWeight: "bold",
                  }}
                  onClick={downloadPDF}
                >
                  Download Report
                </Button>

              </Stack>
            )
          )}

        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityList;