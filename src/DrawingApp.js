import React, { Component, createRef } from "react";
import io from "socket.io-client";
import { SketchPicker } from "react-color";
import "./Styles.css";

const socket = io("https://drawingappackend.onrender.com");

class DrawingApp extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.state = {
      color: "black",
      size: 5,
      drawing: false,
      username: localStorage.getItem("username"),
      onlineUsers: [],
    };
  }

  componentDidMount() {
    this.fetchOnlineUsers();

    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");

    socket.on("updateUsers", this.fetchOnlineUsers);
    socket.emit("request-drawings");

    socket.on("load-drawings", (drawings) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawings.forEach(({ x, y, color, size }) => {
        this.draw(ctx, x, y, color, size);
      });
    });

    socket.on("draw", ({ x, y, color, size }) => {
      this.draw(ctx, x, y, color, size);
    });

    socket.on("clear", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  componentWillUnmount() {
    socket.off("updateUsers", this.fetchOnlineUsers);
    socket.off("draw");
    socket.off("clear");
  }

  fetchOnlineUsers = async () => {
    try {
      const response = await fetch("https://drawingappackend.onrender.com/online-users");
      const data = await response.json();
      if (data.success) {
        this.setState({ onlineUsers: data.users });
      }
    } catch (error) {
      console.error("Error fetching online users:", error);
    }
  };

  draw = (ctx, x, y, color, size) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  handleMouseDown = (e) => {
    this.setState({ drawing: true });
    const ctx = this.canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  handleMouseMove = (e) => {
    if (!this.state.drawing) return;
    const ctx = this.canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    socket.emit("draw", {
      x: offsetX,
      y: offsetY,
      color: this.state.color,
      size: this.state.size,
    });
    this.draw(ctx, offsetX, offsetY, this.state.color, this.state.size);
  };

  handleMouseUp = () => {
    this.setState({ drawing: false });
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

  clearCanvas = () => {
    socket.emit("clear");
  };

  handleColorChange = (color) => {
    this.setState({ color: color.hex });
  };

  handleSizeChange = (e) => {
    this.setState({ size: parseInt(e.target.value) });
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <canvas
        className="canva"
          ref={this.canvasRef}
          width={800}
          height={500}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          style={{ border: "1px solid black", width: "100%", maxWidth: "800px", marginTop: "5px" }}
        />
        <div className="card">
          <div className="bg">
            <div style={{ marginTop: "20px", marginLeft: "20px" }}>
              <label>Brush Color:</label>
              <SketchPicker color={this.state.color} onChange={this.handleColorChange} />
              <br />
              <input
                type="range"
                min="1"
                max="20"
                value={this.state.size}
                style={{ marginLeft: "50px" }}
                onChange={this.handleSizeChange}
              />
            </div>
            <br />
            <div>
              <input type="number" value={this.state.size} onChange={this.handleSizeChange} />
              <button onClick={this.clearCanvas}>Clear</button>
            </div>
          </div>
          <div className="blob"></div>
        </div>
        <div style={{ display: "flex" }}>
          <div className="Usercard">
          <p class="User-c-txt">
            <h3>Welcome, {this.state.username}</h3>
            <p>Online Users:</p>
            <ul>
              {this.state.onlineUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default DrawingApp;
