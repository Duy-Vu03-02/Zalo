import { createContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const optionSocket = {
    transports: ["websocket"],
  };
  const socket = useRef();
  socket.current = io("http://localhost:8080", optionSocket);
  console.log(userData);
  return (
    <UserContext.Provider value={{ userData, socket, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
