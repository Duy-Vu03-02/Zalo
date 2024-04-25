import React, { useEffect, useState } from "react";
import "../../resource/style/Chat/containermess.css";
import avatar from "../../resource/img/Chat/nu9.png";
import videocam from "../../resource/svg/chat/message/containermess/videocam.svg";
import addGroup from "../../resource/svg/chat/message/contact/addGroup.svg";
import search from "../../resource/svg/chat/message/contact/search.svg";
import fast from "../../resource/svg/chat/message/containermess/fast.svg";
import icon from "../../resource/svg/chat/message/containermess/icon.svg";
import email from "../../resource/svg/chat/message/containermess/email.svg";
import like from "../../resource/svg/chat/message/containermess/like.svg";
import emoji from "../../resource/svg/chat/message/containermess/emoji.svg";
import image from "../../resource/svg/chat/message/containermess/image.svg";
import attach from "../../resource/svg/chat/message/containermess/attach.svg";
import screencapture from "../../resource/svg/chat/message/containermess/screencapture.svg";
import contact from "../../resource/svg/chat/message/containermess/contact.svg";
import clock from "../../resource/svg/chat/message/containermess/clock.svg";
import addtodo from "../../resource/svg/chat/message/containermess/addtodo.svg";
import chamthan from "../../resource/svg/chat/message/containermess/chamthan.svg";
import replacebackground from "../../resource/svg/chat/message/containermess/repalcebackground.svg";

export default function ContainerMess() {
  const [colorBackground, setColorBackground] = useState("");
  const [tableColor, setTableColr] = useState(false);
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
    "#fff",
    "#bb5098",
  ];

  useEffect(() => {
    const background = async () => {
      const them = await JSON.parse(localStorage.getItem("them"));
      if (them) {
        setColorBackground(them);
      } else {
        setColorBackground("#fff");
      }
    };
    background();
  }, []);

  const handleSetBackground = (bg) => {
    setColorBackground(bg);
    localStorage.setItem("them", JSON.stringify(bg));
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
            <img src={addGroup} alt="" />
            <img src={search} alt="" />
            <img src={videocam} alt="" />
          </div>
        </div>
        <div
          className="infor-container"
          style={{ backgroundColor: colorBackground }}
        >
          <div></div>
        </div>
        <div className="footer-chat">
          <div className="chat-input flex">
            <div className="flex">
              <img src={emoji} alt="" />
              <img src={image} alt="" />
              <img src={attach} alt="" />
              <img src={screencapture} alt="" />
              <img src={contact} alt="" />
              <img src={addtodo} alt="" />
              <img src={chamthan} alt="" />
              <div className="wrap-setbackground">
                <img
                  src={replacebackground}
                  onClick={handleTableColor}
                  alt=""
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
              <img src={fast} alt="" />
              <img src={icon} alt="" />
              <img src={email} alt="" />
              <img src={like} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
