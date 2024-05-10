import React, { useEffect, useRef, useState, useContext, memo } from "react";
import "../../resource/style/Chat/containermess.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ContactContext } from "../../Context/ContactConext";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoSend, IoVideocamOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { TbBackground } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdAttach } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineContactMail } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { RiEmojiStickerLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { RxDotFilled } from "react-icons/rx";
import axios from "axios";

function ContainerMess({ contactData }) {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState({
    sender: null,
    message: null,
  });
  const [mess, setMess] = useState("");
  const [tableColor, setTableColr] = useState(false);
  const { userData, socket } = useContext(UserContext);
  const { setContact } = useContext(ContactContext);
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
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-mess", (data) => {
        setMessages((prevMessage) => [...prevMessage, data]);
        console.log(messages);
      });
      socket.current.emit("seen-mess", {
        idConversation: contactData.idConversation,
        idSeend: userData._id,
        idChatWith: contactData.idChatWith,
      });
    }
  }, [contactData]);

  const handleSendMess = async (e) => {
    e.preventDefault();
    if (mess !== "") {
      const data = {
        idRecieve: contactData.idChatWith,
        idSend: userData._id,
        idConversation: contactData.idConversation,
        mess: mess,
      };

      socket.current.emit("send-mess", data);
      setMessages((prevMessage) => {
        if (Array.isArray(prevMessage)) {
          return [...prevMessage, { sender: userData._id, message: data.mess }];
        } else {
          return [{ sender: userData._id, message: data.mess }];
        }
      });
      setContact((prevState) => {
        let itemReviece = {};
        const filter = prevState.filter((item) => {
          if (item.idConversation == data.idConversation) {
            item.lastMessage = data.mess;
            item.lastSend = userData._id;
            itemReviece = item;
          } else {
            return item;
          }
        });
        return [itemReviece, ...filter];
      });
      setMess("");
    }
    // cmt
    if (false && mess.trim() !== "") {
      const data = {
        message: mess.trim(),
        user: {
          from: userData._id,
          to: contactData._id,
        },
        sender: userData._id,
      };
      const response = await axios.post(
        "http://127.0.0.1:8080/message/createmessage",
        data
      );
      if (response.status === 200) {
        setMessages((prevMessage) => {
          if (Array.isArray(prevMessage)) {
            return [...prevMessage, { sender: true, message: data.message }];
          } else {
            return [{ sender: true, message: data.message }];
          }
        });
        setMess("");
      }
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const data = {
        userId: userData._id,
        friendId: contactData._id,
      };
      const response = await axios.post(
        "http://127.0.0.1:8080/message/getallmessage",
        { idConversation: contactData.idConversation }
      );
      if (response.status === 200) {
        setMessages(response.data);
      }
    };
    fetch();
  }, [contactData]);
  const handleChangMess = (e) => {
    setMess(e.target.value);
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
              <img src={contactData.avatar || contactData.avatarGroup} alt="" />
            </div>
            <div className="friend-mess-infor">
              <h3>{contactData.username || contactData.groupName}</h3>
              <div>
                {contactData.lastActive !== "Active" ? (
                  <p>
                    Truy cập {contactData.lastActive}
                    {contactData.lastActive == "vừa xong" ? "" : " trước"}
                  </p>
                ) : (
                  <div className="flex">
                    {" "}
                    <RxDotFilled
                      style={{ fontSize: "20px", color: "#30a04b" }}
                    />
                    <p>Đang hoạt động</p>
                  </div>
                )}
              </div>
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
                Array.isArray(messages) &&
                messages.length > 0 &&
                messages.map((item, index) => (
                  <li
                    ref={scrollRef}
                    key={index}
                    className={`wrap-text-mess ${
                      item.sender === userData._id ? "my-mess" : ""
                    } flex`}
                  >
                    <img
                      src={contactData.avatar || contactData.avatarGroup}
                      alt=""
                    />
                    <div className="detail-mess">
                      <p className="name-mess">{contactData.userData}</p>
                      <p className="text-mess">{item.message}</p>
                      <div className="time-mess">
                        <p>10:30</p>
                      </div>
                    </div>
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
                placeholder={`Nhập @, tin nhắn tới ${contactData.username}`}
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

export default memo(ContainerMess);
