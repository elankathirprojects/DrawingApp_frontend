import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DrawingApp from "./DrawingApp";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/draw" element={<DrawingApp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;