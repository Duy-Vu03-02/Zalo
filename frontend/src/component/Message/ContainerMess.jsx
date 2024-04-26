import React, { useEffect, useState, useContext } from "react";
import "../../resource/style/Chat/containermess.css";
import { ThemeContext } from "../../Context/ThemeContext";
import avatar from "../../resource/img/Chat/nu9.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoVideocamOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { TbBackground } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdAttach } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineContactMail } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { RiEmojiStickerLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import io from "socket.io-client";

const optionSocket = {
  transports: ["websocket"],
};
const socket = io("http://localhost:8080", optionSocket);

export default function ContainerMess() {
  const [messages, setMessages] = useState([]);
  const [mess, setMess] = useState("");
  const [tableColor, setTableColr] = useState(false);
  const { theme, handleChangeTheme } = useContext(ThemeContext);
  const codeBackground = [
    "#34568B",
    "rgb(8 108 167)",
    "#a183b3",
    "#88b04b",
    "#b565a7",
    "#dd4124",
    "#d65076",
    "#5b5ea6",
    "#9b2335",
    "#abdde6",
    "#f3bcb6",
    "#ffccb6",
    "#ff968a",
    "#8fcaca",
    "#f4f3f3",
    "#b4426e",
  ];

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  // useEffect(() => {
  //   socket.on("message", (response) => {
  //     setMessages((prevState) => [...prevState, response]);
  //   });

  //   return () => {
  //     socket.off("message");
  //   };
  // }, []);

  const handleChangMess = (e) => {
    setMess(e.target.value);
  };

  const handleSendMess = (e) => {
    // e.preventDefault();
    socket.emit("chat message", mess);
    setMessages("");
  };

  const handleSetBackground = (bg) => {
    handleChangeTheme(bg);
    setTableColr(false);
  };
  const handleTableColor = () => {
    tableColor ? setTableColr(false) : setTableColr(true);
  };
  return (
    <>
      <div className="container-containermess">
        <div className="top-container flex">
          <div className="flex">
            <div className="zavatar">
              <img src={avatar} alt="" />
            </div>
            <div className="friend-mess-infor">
              <h3>A Âm</h3>
              <p>Truy cập 2 giờ trước</p>
            </div>
          </div>
          <div className="group-choice flex">
            <HiOutlineUsers className="icon-header" />
            <CiSearch className="icon-header" />
            <IoVideocamOutline className="icon-header" />
          </div>
        </div>
        <div className="infor-container" style={{ backgroundColor: theme }}>
          <div>
            <ul>
              {messages &&
                messages.map((item, index) => (
                  <li key={index}>
                    <p>{item}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="footer-chat">
          <div className="chat-input flex">
            <div className="flex">
              <RiEmojiStickerLine className="icon-header" />
              <AiOutlinePicture className="icon-header" />
              <IoMdAttach className="icon-header" />
              <IoCameraOutline className="icon-header" />
              <MdOutlineContactMail className="icon-header" />
              <RiCalendarTodoFill className="icon-header" />

              <div className="wrap-setbackground">
                <TbBackground
                  onClick={handleTableColor}
                  className="icon-header"
                />
                <div
                  className={`set-background ${
                    tableColor ? "set-background-active" : ""
                  }`}
                >
                  <ul className="ul-set-background flex">
                    {codeBackground.map((value, index) => (
                      <li
                        key={index}
                        onClick={() => handleSetBackground(value)}
                        style={{ backgroundColor: value }}
                      >
                        &nbsp;
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="chat-input-web flex">
            <div className="wrap-input-chat">
              <input
                type="text"
                value={mess}
                onChange={handleChangMess}
                placeholder="Nhập @, tin nhắn tới A Âm"
              />
            </div>
            <div className="flex">
              <AiOutlineSend
                className="icon-header icon-send-mess"
                style={{
                  color: "rgb(107 173 223)",
                  backgroundColor: "#dff3ff",
                }}
                onClick={handleSendMess}
              />
              <AiOutlineLike className="icon-header" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}