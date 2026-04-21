import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import keycloak from "./keycloak";

// 🔐 Initialize Keycloak FIRST
keycloak
  .init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false, // ✅ avoid login loop bugs
  })
  .then((authenticated) => {
    if (!authenticated) {
      keycloak.login();
      return;
    }

    console.log("✅ Keycloak Authenticated");

    // 🔄 Auto Token Refresh (VERY IMPORTANT)
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log("🔄 Token refreshed");
          }
        })
        .catch(() => {
          console.error("❌ Token refresh failed");
          keycloak.logout();
        });
    }, 60000);

    // 🚀 Render App ONLY after auth ready
    ReactDOM.createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <App keycloak={keycloak} />
      </BrowserRouter>
    );
  })
  .catch((err) => {
    console.error("❌ Keycloak init failed", err);
  });