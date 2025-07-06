import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { cacheManager } from "./utils/cacheUtils";

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "MaxVue: Service worker registered successfully",
          registration,
        );

        // CRITICAL FIX: Initialize deployment cache refresh for new fixes
        cacheManager.initializeDeploymentRefresh();

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("MaxVue: New service worker version available");
                console.log("MaxVue: Forcing cache refresh for updated content");
                // Force cache refresh when new service worker is available
                cacheManager.forceCacheRefresh().then(() => {
                  console.log("MaxVue: Cache refreshed, reloading for new fixes");
                  setTimeout(() => window.location.reload(), 2000);
                });
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log("MaxVue: Service worker registration failed", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
