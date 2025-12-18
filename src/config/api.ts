export const API_CONFIG = {
  // Google Apps Script Web App URL (deploy as web app)
  APPS_SCRIPT_URL: import.meta.env.VITE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  
  // Base URL for check-in links (your deployed frontend URL)
  CHECK_IN_BASE_URL: import.meta.env.VITE_CHECK_IN_BASE_URL || "http://localhost:5173",
  
  // Development mode (uses mock data)
  DEV_MODE: import.meta.env.VITE_DEV_MODE === "true" || true,
  
  // Event days configuration
  EVENT_DAYS: ["Day 1", "Day 2"],
};
