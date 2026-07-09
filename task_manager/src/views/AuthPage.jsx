import React, { useState } from 'react';
import './AuthPage.css';
import FormInput from '../components/FormInput';

function AuthPage({ apiBaseUrl, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      try {
        const res = await fetch(`${apiBaseUrl}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Signup broken");
        alert("Account registered!");
        setIsRegistering(false);
      } catch (err) { alert(err.message); }
    } else {
      try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        const res = await fetch(`${apiBaseUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Unauthorized");
        localStorage.setItem("token", data.access_token);
        onLoginSuccess(data.access_token);
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="login-container">
      <div className="logo-title">
        <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'none', stroke: 'blue', strokeWidth: '2.5' }}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
        Mytask
      </div>
      <h1 className="heading">{isRegistering ? "get started" : "welcome back"}</h1>
      <p className="subheading">{isRegistering ? "create an account to track your tasks" : "login to see your task"}</p>
      
      <div className="login-box">
        <form onSubmit={handleAuthSubmit}>
          <FormInput label="Username" type="text" placeholder="your username" value={username} onChange={(e) => setUsername(e.target.value)} />
          {isRegistering && <FormInput label="Email" type="email" placeholder="your email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          <FormInput label="Password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="submit-button">{isRegistering ? "sign up" : "login"}</button>
        </form>
      </div>
      <div className="footer-text">
        {isRegistering ? "Already have an account? " : "Don't have an account? "}
        <button className="link-btn" onClick={() => setIsRegistering(!isRegistering) }>{isRegistering ? "Login" : "Signup"}</button>
      </div>
    </div>
  );
}

export default AuthPage;