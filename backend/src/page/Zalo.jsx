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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.mateKey) && e.key === "a") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChangeStateChat = () => {
    setChat(true);
  };

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      if (token !== null) {
        const data = {
          sessiontoken: JSON.parse(token),
        };
        const response = await axios.post(
          "http://127.0.0.1:8080/auth/sessiontoken",
          data
        );
        if (response.status === 200) {
          setUserData(response.data);
          setChat(true);
          localStorage.setItem(
            "token",
            JSON.stringify(response.data.authentication.sessionToken)
          );
          setIsLoadding(false);
        } else {
          setChat(false);
          setIsLoadding(false);
        }
      }
      setIsLoadding(false);
    };
    fetch();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setChat(false);
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
