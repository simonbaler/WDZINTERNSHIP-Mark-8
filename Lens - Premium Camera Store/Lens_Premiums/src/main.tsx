// This is the main entry point for our React app
// Importing all the stuff we need
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import './i18n';
import ErrorBoundary from "./components/ErrorBoundary";

// Getting the root element from HTML
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find the root element");
}

// Creating the root for React
const root = createRoot(rootEl);

// Trying to render the app
try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('App rendered successfully!'); // Debug log
} catch (error) {
  console.error('Error rendering app:', error);
}

// Service worker stuff for offline caching
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((err) => {
			console.warn('Service worker registration failed:', err);
		});
	});
}
