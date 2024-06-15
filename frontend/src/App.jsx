import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Chat from "./page/Chat";
import Zalo from "./page/Zalo";
import VideoCall from "./page/VideoCall";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Zalo />} />
        <Route path="/videocall" element={<VideoCall />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
