import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style1.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const response = await fetch("https://drawingappackend.onrender.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (data.success) {
      navigate("/");
    } else {
      alert("Signup failed");
    }
  };

  return (
<div className="login-container">
<h2>Sign Up</h2>
<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button onClick={handleSignup}>Sign Up</button>
<p>Already have an account? <a href="/">Login</a></p>
</div>
  );
}

export default Signup;
