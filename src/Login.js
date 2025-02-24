import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style1.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8081/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("username", username); 
      window.dispatchEvent(new Event("storage"));
      navigate("/draw");
    } else {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="login-container">
    <h2>Login</h2>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleLogin}>Login</button>
    <p>Don't have an account? <a href="/signup">Sign up</a></p>
  </div>
  
  );
}

export default Login;