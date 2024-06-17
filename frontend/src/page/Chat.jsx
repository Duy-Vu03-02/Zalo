import React, { useState, useEffect, useContext, memo, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import "../resource/style/Chat/chat.css";
import Message from "../component/Message/Message";
import AddressBook from "../component/AddressBook/AddressBook";
import Setting from "../component/Setting/Setting";
import mess from "../resource/svg/chat/chat.svg";
import addressbook from "../resource/svg/chat/addressbook.svg";
import todo from "../resource/svg/chat/todo.svg";
import cloud from "../resource/svg/chat/cloud.svg";
import toolbox from "../resource/svg/chat/toolbox.svg";
import setting from "../resource/svg/chat/setting.svg";
import { SlCallEnd } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { getFriendById } from "../util/api";
import chuong from "../resource/mp3/chuong.mp3";

function Chat({ handleLogout }) {
  const { userData, socket } = useContext(UserContext);

  const [urlCall, setUrlCall] = useState(null);
  const [friendCall, setFriendCall] = useState(null);

  const [showPageAddressBook, setShowPageAddressBook] = useState(false);
  const topMenu = [mess, addressbook, todo];
  const bottomMenu = [cloud, toolbox, setting];
  const [menuActive, setMenuactive] = useState(0);
  const listComponent = [
    <Message showPageAddressBook={showPageAddressBook} />,
    <AddressBook onClick={() => handleShowPageAddressBook(true)} />,
    1,
    1,
    1,
  ];
  const CurrentComponent = listComponent[menuActive];
  const [isShowStartup, setIsShoeStartup] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const boxRef = useRef(null);
  const boxAvatar = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("end-meeting", () => {
        console.log("end meeting");
        setUrlCall(null);
        setFriendCall(null);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("end-meeting");
      }
    };
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      const fetch = async () => {
        socket.current.on("join-room-call", async (data) => {
          setUrlCall(data.url);
          const caller = await getFriendById({
            friendId: data.url.split("id=")[1],
          });
          if (caller.status === 200) {
            setFriendCall(caller.data);
          }
        });
      };
      fetch();
    }
    return () => {
      socket.current.off("join-room-call");
    };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !boxAvatar.current.contains(event.target) &&
        boxRef.current &&
        !boxRef.current.contains(event.target)
      ) {
        setIsShoeStartup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef, setIsShoeStartup]);

  const handleChangeMenuActive = (index) => {
    if (index === 0 || index === 1) {
      setMenuactive(index);
    } else if (index === 5) {
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

  const handleAcceptCall = () => {
    const windowName = "_blank";
    const windowFeatures = "width=1300,height=700,resizable=yes";
    const newWindow = window.open(urlCall, windowName, windowFeatures);

    if (newWindow) {
      newWindow.onbeforeunload = () => {
        return false; // Ngăn cản cửa sổ đóng lại
      };
    }

    setUrlCall(null);
    setFriendCall(null);
  };

  const DonotAcceptCall = () => {
    if (socket.current) {
      socket.current.emit("do-not-accept-call", {
        userCallerId: friendCall._id,
      });
      setUrlCall(null);
      setFriendCall(null);
    }
  };

  /// Video call
  const handleRePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <>
      <div className="flex">
        <div className="chat-menu-left ">
          <div className="chat-top-menu">
            <div className="chat-avatar-user">
              <img
                ref={boxAvatar}
                src={userData.avatar}
                alt=""
                onClick={handleShowStartup}
              />
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
          {friendCall ? (
            <div className="screen-mask">
              <div className="audio-chuong none">
                <audio src={chuong} controls autoPlay onEnded={handleRePlay} />
              </div>
              <div className="dialog-call">
                <div
                  className="header-add-friend"
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                    border: "none",
                  }}
                  onClick={() => {
                    setUrlCall(null);
                    setFriendCall(null);
                  }}
                >
                  <IoMdClose className="btn-close" />
                </div>
                <div style={{ width: "350px" }}>
                  <div
                    style={{
                      padding: "15px 0",
                      margin: "0 20px 10px 20px",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      color: "#2f2b2b",
                      borderBottom: "2px solid rgb(215 223 234)",
                    }}
                  >
                    cuộc gọi đến
                  </div>
                  <img src={friendCall.avatar} alt="" />
                  <p style={{ textAlign: "center" }}>{friendCall.username}</p>
                  <p style={{ textAlign: "center", fontSize: "12px" }}>
                    đang gọi . . .
                  </p>
                  <div className="flex" style={{ justifyContent: "center" }}>
                    <div
                      className="padding-icon"
                      style={{ color: "white", background: "rgb(233, 30, 30)" }}
                    >
                      <SlCallEnd
                        className="icon-accept-call"
                        onClick={DonotAcceptCall}
                      />
                    </div>
                    <div
                      className="padding-icon"
                      style={{
                        color: "white",
                        backgroundColor: "rgb(48, 160, 75)",
                      }}
                      onClick={handleAcceptCall}
                    >
                      <SlCallEnd className="icon-reject-call" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            showSetting && <Setting handleShowSetting={handleShowSetting} />
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Chat);
