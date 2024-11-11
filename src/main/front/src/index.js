// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider as CustomThemeProvider } from './DarkMode/ThemeContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomThemeProvider>
  </React.StrictMode>
);

reportWebVitals();