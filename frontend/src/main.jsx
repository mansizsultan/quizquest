import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Tambahkan AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>  {/* Pindahkan AuthProvider ke sini */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
