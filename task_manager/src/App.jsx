import React, { useState } from 'react';
import AuthPage from './views/AuthPage';
import DashboardPage from './views/DashboardPage';


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div>
      {token ? (
        <DashboardPage 
          apiBaseUrl={API_BASE_URL} 
          token={token} 
          onLogout={() => { localStorage.removeItem("token"); setToken(""); }} 
        />
      ) : (
        <AuthPage 
          apiBaseUrl={API_BASE_URL} 
          onLoginSuccess={(newToken) => setToken(newToken)} 
        />
      )}
    </div>
  );
}

export default App;
