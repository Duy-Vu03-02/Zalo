import React, { useEffect, useState, useRef } from "react";
import "../../resource/style/Chat/messageInfor.css";
import avatar from "../../resource/img/Chat/nu9.png";
import edit from "../../resource/svg/chat/message/messageinfor/edit.svg";
import bell from "../../resource/svg/chat/message/messageinfor/bell.svg";
import pin from "../../resource/svg/chat/message/messageinfor/pin.svg";
import addgroup from "../../resource/svg/chat/message/messageinfor/addgroup.svg";
import nam9 from "../../resource/img/Chat/VuongAnVu.png";
import nu9 from "../../resource/img/Chat/nu9.png";
import nam8 from "../../resource/img/Chat/namphu.png";

export default function MessageInfor() {
  const ref = useRef(null);
  const [colorBackground, setColorBackground] = useState("");
  const [showTool, setShowTool] = useState([]);
  const imgs = [nu9, nu9, nu9, nu9, nu9, nu9, nu9, nu9, nu9];
  const listOption = [
    "Danh sách nhắc hẹn",
    "Ảnh/Video",
    "File",
    "Link",
    "Thiết lập bảo mật",
  ];

  useEffect(() => {
    const fetchBackround = async () => {
      const them = await JSON.parse(localStorage.getItem("them"));
      if (them) {
        setColorBackground(them);
      } else {
        setColorBackground("#fff");
      }
    };
    fetchBackround();
  }, []);

  const handleShowTool = (index) => {
    setShowTool((prevState) => {
      const check = prevState.includes(index);
      if (check) {
        return prevState.filter((x) => x !== index);
      } else {
        return [...prevState, index];
      }
    });
  };

  return (
    <>
      <div
        className="mess-infor-container-messageinfor"
        style={{ backgroundColor: colorBackground }}
      >
        <div className="mess-infor-title-text flex">
          <h3>Thông tin hội thoại</h3>
        </div>
        <div className="mess-infor-scrool-header">
          <div className="mess-infor-header-infor">
            <div className="mess-infor-wrap-avatar">
              <img className="mess-infor-avatar-infor" src={avatar} alt="" />
              <div className="mess-infor-nickname flex">
                <p>A âm</p>
                <img src={edit} alt="" />
              </div>
            </div>
            <div className="mess-infor-header-infor-tool flex">
              <div>
                <img src={bell} alt="" />
                <p>Tắt thông báo</p>
              </div>
              <div>
                <img src={pin} alt="" />
                <p>Ghim hội thoại</p>
              </div>
              <div>
                <img src={addgroup} alt="" />
                <p>Tạo nhóm trò truyện</p>
              </div>
            </div>
          </div>
          <div className="mess-infor-footer-tool" ref={ref}>
            <ul>
              {listOption.map((data, index) => (
                <li key={index}>
                  <div
                    onClick={() => handleShowTool(index)}
                    className="title-tool flex"
                  >
                    <p>{data}</p>
                    <div
                      className={`mess-infor-detial-tool ${
                        showTool.includes(index) ? "mess-infor-tool-active" : ""
                      }`}
                    >
                      <svg height="10" width="50">
                        <polygon points="25,0 50,50 0,50" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={`list-data-tool ${
                      showTool.includes(index) ? "li-tool-active" : ""
                    }`}
                  >
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                    <img src={nu9} alt="" />
                  </div>
                  <div
                    className={`btn-all-data ${
                      showTool.includes(index) ? "block" : "none"
                    }`}
                  >
                    <p>Xem tất cả</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mess-infor-fill-namespace">&nbsp;</div>
        </div>
      </div>
    </>
  );
}
