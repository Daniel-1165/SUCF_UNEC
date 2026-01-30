import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

console.log('🚀 Main.jsx loaded - Starting app...');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
