import React, { useEffect, useState, useContext } from "react";
import "../../resource/style/Chat/containermess.css";
import { ThemeContext } from "../../Context/ThemeContext";
import avatar from "../../resource/img/Chat/nu9.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoVideocamOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { TbBackground } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdAttach } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineContactMail } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { RiEmojiStickerLine } from "react-icons/ri";
import { RxFace } from "react-icons/rx";

export default function ContainerMess() {
  const [tableColor, setTableColr] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  console.log(theme);
  const codeBackground = [
    "#34568B",
    "#ff6f61",
    "#6b5b95",
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
    "#bb5098",
  ];

  const handleSetBackground = (bg) => {
    setTheme(bg);
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
          <div></div>
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
            <div>
              <input type="text" placeholder="Nhập @, tin nhắn tới A Âm" />
            </div>
            <div>
              <AiOutlineThunderbolt className="icon-header" />
              <RxFace className="icon-header" />
              <AiOutlineLike className="icon-header" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
