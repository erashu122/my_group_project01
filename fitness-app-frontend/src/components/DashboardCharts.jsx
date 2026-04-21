import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import BarChartIcon from "@mui/icons-material/BarChart";

import { getActivities } from "../services/api";

const DashboardCharts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getActivities();
      const activities = res.data;

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const grouped = {};

      days.forEach((d) => (grouped[d] = 0));

      activities.forEach((a) => {
        const date = new Date(a.createdAt || Date.now());
        const day = days[date.getDay()];
        grouped[day] += a.caloriesBurned;
      });

      const chartData = days.map((d) => ({
        day: d,
        calories: grouped[d],
      }));

      setData(chartData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 STATS
  const totalCalories = data.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = totalCalories / (data.length || 1);
  const activityCount = data.filter(d => d.calories > 0).length;

  const bestDay = data.reduce(
    (max, d) => (d.calories > max.calories ? d : max),
    { calories: 0 }
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* HEADER */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Weekly Performance 🚀
      </Typography>

      {/* 🔥 KPI CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>

        {/* TOTAL */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
            }}
          >
            <LocalFireDepartmentIcon />
            <Typography variant="body2">Total Calories</Typography>
            <Typography variant="h6">{totalCalories}</Typography>
          </Box>
        </Grid>

        {/* AVG */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#22c55e,#15803d)",
              color: "#fff",
            }}
          >
            <BarChartIcon />
            <Typography variant="body2">Avg / Day</Typography>
            <Typography variant="h6">
              {Math.round(avgCalories)}
            </Typography>
          </Box>
        </Grid>

        {/* BEST DAY */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#f97316,#c2410c)",
              color: "#fff",
            }}
          >
            <WhatshotIcon />
            <Typography variant="body2">Best Day</Typography>
            <Typography variant="h6">
              {bestDay.day || "-"}
            </Typography>
          </Box>
        </Grid>

        {/* COUNT */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#a855f7,#6b21a8)",
              color: "#fff",
            }}
          >
            <Typography variant="body2">Active Days</Typography>
            <Typography variant="h6">{activityCount}</Typography>
          </Box>
        </Grid>

      </Grid>

      {/* 📈 CHART */}
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="day" stroke="#ccc" />
            <YAxis stroke="#ccc" />

            <Tooltip
              contentStyle={{
                background: "#111",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="calories"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default DashboardCharts;