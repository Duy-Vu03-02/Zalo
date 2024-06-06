import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import Login from "./Login";
import Chat from "./Chat";
import Loadding from "./Loadding";
import { userLogout, userLoginByToken } from "../util/api";

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

  useEffect(() => {
    const fetchLoginToken = async () => {
      try {
        const response = await userLoginByToken();
        if (response.status === 200) {
          setUserData(response.data);
          setChat(true);
        } else {
          setChat(false);
        }
        setIsLoadding(false);
      } catch (err) {
        setIsLoadding(false);
      }
    };
    fetchLoginToken();
  }, []);

  const handleLogout = async () => {
    const response = await userLogout();
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
