import React, { useState, useEffect, useContext, memo, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import io from "socket.io-client";
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

function Chat({ handleLogout }) {
  const { userData, socket } = useContext(UserContext);

  const [showPageAddressBook, setShowPageAddressBook] = useState(false);
  const topMenu = [mess, addressbook, todo];
  const bottomMenu = [cloud, toolbox, setting];
  const [menuActive, setMenuactive] = useState(0);
  const listComponent = [
    <Message showPageAddressBook={showPageAddressBook} />,
    <AddressBook onClick={() => handleShowPageAddressBook(true)} />,
    <ToDo />,
    <Clod />,
    <ToolBox />,
  ];
  const CurrentComponent = listComponent[menuActive];
  const [isShowStartup, setIsShoeStartup] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const boxRef = useRef();
  // useEffect(() => {
  //   if (userData !== null) {
  //     socket.current = io("http://localhost:8080");
  //     socket.current.emit("add-user", { id: userData._id });
  //   }
  // }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsShoeStartup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef, setIsShoeStartup]);

  const handleChangeMenuActive = (index) => {
    if (index !== 5) {
      setMenuactive(index);
    } else {
      handleShowSetting(true);
    }
  };
  const handleShowSetting = (value) => {
    setShowSetting(value);
  };

  const handleShowStartup = () => {
    isShowStartup ? setIsShoeStartup(false) : setIsShoeStartup(true);
  };
  const handleShowPageAddressBook = (value) => {
    setShowPageAddressBook(value);
  };

  return (
    <>
      <div className="flex">
        <div className="chat-menu-left ">
          <div className="chat-top-menu">
            <div className="chat-avatar-user">
              <img src={userData.avatar} alt="" onClick={handleShowStartup} />
              {isShowStartup && (
                <div ref={boxRef} className="startup">
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
        <div>{CurrentComponent}</div>
        <div>
          {showSetting && <Setting handleShowSetting={handleShowSetting} />}
        </div>
      </div>
    </>
  );
}

export default memo(Chat);
