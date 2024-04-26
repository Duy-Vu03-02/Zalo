// import React from "react";
// import "./index.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./page/Login";
// import Register from "./page/Register";
// import Chat from "./page/Chat";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Chat />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { useState, useEffect, useRef } from "react";
import "./App.css";
import io from "socket.io-client";

const optionSocket = {
  transports: ["websocket"],
};
const socket = io("http://localhost:8080", optionSocket);

function App() {
  const [data, setData] = useState([]);
  const [res, setRes] = useState({
    mess: "",
    user: "",
  });

  useEffect(() => {
    socket.on("chat message", (response) => {
      setData((prevState) => [...prevState, response]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleChange = (e) => {
    setRes((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSendMess = (e) => {
    e.preventDefault();
    socket.emit("chat message", res);
    setRes((prevState) => {
      return {
        ...prevState,
        mess: "",
      };
    });
  };

  return (
    <>
      <h1>App chat</h1>

      <ul>
        {data &&
          data.map((item, index) => (
            <li key={index}>
              <p style={{ color: "black" }}>
                {item.user} : {item.mess}
              </p>
            </li>
          ))}
      </ul>

      <input type="text" name="user" value={res.user} onChange={handleChange} />
      <br />
      <input
        type="text"
        value={res.mess}
        name="mess"
        onChange={handleChange}
        placeholder="Nhập"
      />
      <button onClick={handleSendMess}>Gửi</button>
    </>
  );
}

export default App;
