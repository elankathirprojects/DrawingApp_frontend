import React, { useState, useEffect } from "react";
import "./Styles.css";

function Header() {
  const [username, setUsername] = useState(localStorage.getItem("username")); 

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username")); 
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const Logout = () => {
    if (!username) {
      alert("User not found!");
      return;
    }

    fetch("https://drawingappackend.onrender.com/logout", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.removeItem("username");
          setUsername(null); 
          window.dispatchEvent(new Event("storage")); 
          window.location.href = "/";
        } else {
          alert("Logout failed!");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <header
      style={{
        background: "#333",
        color: "white",
        padding: "10px",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
<h1><img src={'/drawingimg.png'} style={{height:'35px',width:'40px'}} /> 
  Real-Time Drawing App</h1>
      {username && (
        <button
        className="logoutbtn"
          onClick={Logout}
          style={{
            color: "black",
            backgroundColor: "darkgray",
            height: "40px",
            borderRadius: "10px",
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;

