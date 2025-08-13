import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from "./utils/auth";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import { theme } from "./theme/theme";

function App() {
  console.log("App component rendering...");
  
  try {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ color: '#1976d2' }}>ePathshala Error</h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}

export default App;