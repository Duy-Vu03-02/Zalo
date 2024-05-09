import React, { useEffect, useState, useRef, useContext, memo } from "react";
import "../../resource/style/Chat/messageInfor.css";
import { ThemeContext } from "../../Context/ThemeContext";
import avatar from "../../resource/img/Chat/nu9.png";
import { AiOutlineBell } from "react-icons/ai";
import { GoPin } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { IoTriangle } from "react-icons/io5";

import nu9 from "../../resource/img/Chat/nu9.png";

function MessageInfor({ contactData }) {
  const ref = useRef(null);
  const [showTool, setShowTool] = useState([]);
  const { theme } = useContext(ThemeContext);
  const listOption = [
    "Danh sách nhắc hẹn",
    "Ảnh/Video",
    "File",
    "Link",
    "Thiết lập bảo mật",
  ];

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
        style={{ backgroundColor: theme }}
      >
        <div className="mess-infor-title-text flex">
          <h3>Thông tin hội thoại</h3>
        </div>
        <div className="mess-infor-scrool-header">
          <div className="mess-infor-header-infor">
            <div className="mess-infor-wrap-avatar">
              <img
                className="mess-infor-avatar-infor"
                src={contactData.avatar || contactData.avatarGroup}
                alt=""
              />
              <div className="mess-infor-nickname flex">
                <p>{contactData.username || contactData.groupName}</p>
                <CiEdit style={{ fontSize: "23px", cursor: "pointer" }} />
              </div>
            </div>
            <div className="mess-infor-header-infor-tool flex">
              <div>
                <AiOutlineBell className="icon-tool-mess" />
                <p>Tắt thông báo</p>
              </div>
              <div>
                <GoPin className="icon-tool-mess" />
                <p>Ghim hội thoại</p>
              </div>
              <div>
                <HiOutlineUsers className="icon-tool-mess" />
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
                      <IoTriangle
                        style={{ color: "#7589a3", fontSize: "11px" }}
                      />
                    </div>
                  </div>
                  <div
                    className={` ${
                      showTool.includes(index)
                        ? "li-tool-active"
                        : "li-tool-none"
                    }`}
                  >
                    <div className={`list-data-tool`}>
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                      <img src={nu9} alt="" />
                    </div>
                    <div className={`btn-all-data `}>
                      <p>Xem tất cả</p>
                    </div>
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

export default memo(MessageInfor);
