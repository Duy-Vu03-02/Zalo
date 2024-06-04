import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import Login from "./Login";
import Chat from "./Chat";
import Loadding from "./Loadding";
import axios from "axios";

export default function Zalo() {
  const [chat, setChat] = useState(false);
  const { setUserData } = useContext(UserContext);
  const [isLoadding, setIsLoadding] = useState(true);

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if ((e.ctrlKey || e.mateKey) && e.key === "a") {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  const handleChangeStateChat = () => {
    setChat(true);
  };

  // useEffect(() => {
  //   const fetch = async () => {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8080/auth/token",
  //       {},
  //       { withCredentials: true }
  //     );
  //     console.log(response);
  //     if (response.status === 200) {
  //       setUserData(response.data);
  //       setChat(true);
  //       return;
  //     }
  //     setChat(false);
  //     setIsLoadding(true);
  //   };
  //   fetch();
  // }, []);

  useEffect(() => {
    const fetchLoginToken = async () => {
      const url = "http://localhost:8080/auth/token";
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        console.log(response);
        setUserData(response.data);
        setChat(true);
      } else {
        setChat(false);
      }
      setIsLoadding(false);
    };
    fetchLoginToken();
  }, []);

  const handleLogout = async () => {
    const url = "http://localhost:8080/auth/logout";
    const response = await axios.post(url, {}, { withCredentials: true });

    if (response.status === 200) {
      localStorage.clear();
      setChat(false);
    }
  };

  return (
    <>
      {isLoadding ? (
        <Loadding />
      ) : chat ? (
        <Chat handleLogout={handleLogout} />
      ) : (
        <Login handleChangeStateChat={handleChangeStateChat} />
      )}
    </>
  );
}
