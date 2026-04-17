import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Signup from "./components/Signup";
import { getCurrentUser } from "./services/api";
import { setUserId } from "./store/authSlice";


const ActvitiesPage = () => {
  return (<Box sx={{ p: 2, border: '1px dashed grey' }}>
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <ActivityList />
  </Box>);
}

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  
  useEffect(() => {
  const fetchUser = async () => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));

      try {
        const res = await getCurrentUser();
        dispatch(setUserId(res.data.id));
        console.log("✅ USER ID:", res.data.id);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }

      setAuthReady(true);
    }
  };

  fetchUser();
}, [token]);

  return (
    <Router>
      <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <Routes>
          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/activities"
            element={token ? <ActvitiesPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/activities/:id"
            element={token ? <ActivityDetail /> : <Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={
              !token ? (
                <Box
                  sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    Welcome to the Fitness Tracker App
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 3 }}>
                    Please login to access your activities
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      logIn();
                    }}
                  >
                    LOGIN
                  </Button>
                  <Button onClick={() => (window.location.href = "/signup")}>Signup</Button>
                </Box>
              ) : (
                <Navigate to="/activities" replace />
              )
            }
          />
        </Routes>

        {token && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={logOut}>
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </Router>
  );
}

export default App
