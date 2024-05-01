import React, { useState, useEffect, useContext, memo } from "react";
import { UserContext } from "../Context/UserContext";
import "../resource/style/Chat/chat.css";
import Message from "../component/Message/Message";
import AddressBook from "../component/AddressBook/AddressBook";
import ToDo from "../component/ToDo/ToDo";
import Clod from "../component/Cloud/Cloud";
import ToolBox from "../component/ToolBox/ToolBox";
import Setting from "../component/Setting/Setting";
import mess from "../resource/svg/chat/chat.svg";
import addressbook from "../resource/svg/chat/addressbook.svg";
import todo from "../resource/svg/chat/todo.svg";
import cloud from "../resource/svg/chat/cloud.svg";
import toolbox from "../resource/svg/chat/toolbox.svg";
import setting from "../resource/svg/chat/setting.svg";

import io from "socket.io-client";
const optionSocket = {
  transports: ["websocket"],
};
export const socket = io("http://localhost:8080", optionSocket);

function Chat({ handleLogout }) {
  const { userData } = useContext(UserContext);
  const topMenu = [mess, addressbook, todo];
  const bottomMenu = [cloud, toolbox, setting];
  const [menuActive, setMenuactive] = useState(0);
  const listComponent = [Message, AddressBook, ToDo, Clod, ToolBox, Setting];
  const CurrentComponent = listComponent[menuActive];
  const [isShowStartup, setIsShoeStartup] = useState(false);

  useEffect(() => {
    socket.emit("add-user", userData._id);
  }, []);

  const handleChangeMenuActive = (index) => {
    setMenuactive(index);
  };

  const handleShowStartup = () => {
    isShowStartup ? setIsShoeStartup(false) : setIsShoeStartup(true);
  };

  return (
    <>
      <div className="flex">
        <div className="chat-menu-left ">
          <div className="chat-top-menu">
            <div className="chat-avatar-user">
              <img
                src={userData.avatarImage}
                alt=""
                onClick={handleShowStartup}
              />
              {isShowStartup && (
                <div className="startup">
                  <p>{userData.username}</p>
                  <div>
                    <p>Hồ sơ của bạn</p>
                    <p>Cài đặt</p>
                  </div>
                  <p onClick={handleLogout}>Đăng xuất</p>
                </div>
              )}
            </div>
            <div>
              <ul>
                {topMenu.map((value, index) => (
                  <li
                    onClick={() => handleChangeMenuActive(index)}
                    className={`${
                      index === menuActive ? "chat-menu-left-active" : ""
                    }`}
                    key={index}
                  >
                    <img src={value} alt="" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chat-bottom-menu">
            <div>
              <ul>
                {bottomMenu.map((value, index) => (
                  <li
                    key={index}
                    onClick={() => handleChangeMenuActive(index + 3)}
                    className={`${
                      index + 3 === menuActive ? "chat-menu-left-active" : ""
                    }`}
                  >
                    <img src={value} alt="" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <CurrentComponent />
        </div>
      </div>
    </>
  );
}

export default memo(Chat);
