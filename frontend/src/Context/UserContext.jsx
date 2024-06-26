import { createContext, useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const optionSocket = {
    transports: ["websocket"],
  };
  const socket = useRef();

  useEffect(() => {
    if (userData !== null) {
      socket.current = io("https://192.168.41.26");
      socket.current.emit("add-user", { id: userData._id });
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        socket,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
