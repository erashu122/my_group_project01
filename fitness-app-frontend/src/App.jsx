import { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fab,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Signup from "./components/Signup";
import { getCurrentUser } from "./services/api";
import { setCredentials, setUserId } from "./store/authSlice";

const ActivitiesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add New Activity
            </Typography>
            <ActivityForm onActivityAdded={() => setRefreshTrigger((prev) => prev + 1)} />
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Activities
            </Typography>
            <ActivityList refreshTrigger={refreshTrigger} />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        return;
      }

      dispatch(setCredentials({ token, user: tokenData }));

      try {
        const res = await getCurrentUser();
        dispatch(setUserId(res.data.id));
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();
  }, [dispatch, token, tokenData]);

  return (
    <Router>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6fb" }}>
        {token && (
          <AppBar position="static" elevation={1} color="inherit">
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                Fitness Tracker
              </Typography>
              <Button variant="contained" color="secondary" onClick={logOut}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}

        <Routes>
          <Route path="/signup" element={<Signup />} />

          <Route path="/activities" element={token ? <ActivitiesPage /> : <Navigate to="/" replace />} />

          <Route path="/activities/:id" element={token ? <ActivityDetail /> : <Navigate to="/" replace />} />

          <Route
            path="/"
            element={
              !token ? (
                <Container maxWidth="sm" sx={{ py: 10 }}>
                  <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                    <CardContent sx={{ p: 5, textAlign: "center" }}>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        Welcome to Fitness Tracker
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Track activities, monitor calories, and get smarter health suggestions.
                      </Typography>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button variant="contained" size="large" onClick={logIn}>
                          Login
                        </Button>
                        <Button variant="outlined" size="large" onClick={() => (window.location.href = "/signup")}>
                          Sign Up
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Container>
              ) : (
                <Navigate to="/activities" replace />
              )
            }
          />
        </Routes>

        <Tooltip title="Open ChatGPT for fitness suggestions">
          <Fab
            color="primary"
            aria-label="open-chatgpt"
            onClick={() => window.open("https://chat.openai.com", "_blank", "noopener,noreferrer")}
            sx={{ position: "fixed", right: 24, bottom: 24, fontSize: 22 }}
          >
            🤖
          </Fab>
        </Tooltip>
      </Box>
    </Router>
  );
}

export default App;
