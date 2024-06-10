import React, { useEffect, useRef, useState, useContext, memo } from "react";
import "../../resource/style/Chat/containermess.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ContactContext } from "../../Context/ContactConext";
import Icon from "./Icon";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoSend, IoVideocamOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { TbBackground } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdAttach } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineContactMail } from "react-icons/md";
import { RiCalendarTodoFill, RiChatCheckFill } from "react-icons/ri";
import { RiEmojiStickerLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { RxDotFilled } from "react-icons/rx";
import { IoCallOutline } from "react-icons/io5";
import axios from "axios";
import { getMessageByConversation } from "../../util/api/index.jsx";

function ContainerMess({ contactData }) {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState({
    sender: null,
    message: null,
    imgMess: null,
  });
  const [listMessImg, setListMessImg] = useState([]);
  const [tableColor, setTableColr] = useState(false);
  const [menuControl, setMenuControl] = useState({
    tableColor: false,
    tableIcon: false,
    tablePicture: false,
  });
  const { userData, socket } = useContext(UserContext);
  const { setContact } = useContext(ContactContext);
  const { theme, handleChangeTheme } = useContext(ThemeContext);
  const [activeIconSend, setActiveIconSend] = useState(false);
  const inputMessage = useRef(null);
  const tableIconRef = useRef(null);
  const iconRef = useRef(null);
  const tableBackgroundRef = useRef(null);
  const iconBackgroundRef = useRef(null);
  const tablePictureRef = useRef(null);
  const iconPictureRef = useRef(null);

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

  // useEffect(() => {
  //   function handleClickOutsideMenu(event) {
  //     const option = {
  //       tableIcon: iconRef.current.contains(event.target),
  //       tablePicture: iconPictureRef.current.contains(event.target),
  //       tableColor: iconBackgroundRef.current.contains(event.target),
  //     };
  // if (
  //   (iconBackgroundRef && !option.tableColor) ||
  //   (iconRef && !option.tableIconRef) ||
  //   (iconPicture && !option.tablePicture)
  // ) {
  //   // setMenuControl({
  //   //   tableColor: false,
  //   //   tableIcon: false,
  //   //   tablePicture: false,
  //   // });
  //   // handleChangeMenuControl(event);
  //   console.log(event);
  // }
  // if (!option.tableIcon && !option.tablePicture && !option.tableColor) {
  //   // setMenuControl(option);
  //   return;
  // }
  // if (menuControl.tableIcon && !option.tableIcon) {
  //   setMenuControl({
  //     tableIcon: false,
  //     tablePicture: "",
  //     tableColor: ,
  //   });
  // }
  //   }

  //   document.addEventListener("mousedown", handleClickOutsideMenu);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutsideMenu);
  //   };
  // }, [menuControl]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-mess", handleRecieveMessage);
      socket.current.emit("seen-mess", {
        idConversation: contactData.idConversation,
        idSeend: userData._id,
        idChatWith: contactData.idChatWith,
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("recieve-mess", handleRecieveMessage);
      }
    };
  }, [contactData]);

  const handleRecieveMessage = (data) => {
    if (data.idConversation === contactData.idConversation) {
      setMessages((prevMessage) => [...prevMessage, data]);
    }
  };

  const handleSendMess = async (e, flag = false) => {
    const message = flag ? "👍" : inputMessage.current.textContent;
    if (
      (message.trim() !== "" && message.trim() !== null) ||
      (listMessImg && listMessImg.length > 0)
    ) {
      setActiveIconSend(false);
      inputMessage.current.textContent = "";
      setListMessImg(null);
      e.preventDefault();
      const data = {
        idRecieve: contactData.idChatWith,
        idSend: userData._id,
        idConversation: contactData.idConversation,
        mess: message.trim(),
        imgMess: listMessImg,
        updatedAt: new Date(),
      };
      socket.current.emit("send-mess", data);
      // set mess
      setMessages((prevMessage) => {
        if (Array.isArray(prevMessage)) {
          return [
            ...prevMessage,
            {
              sender: userData._id,
              message: data.mess,
              imgMess: data.imgMess,
              updatedAt: data.updatedAt,
            },
          ];
        } else {
          return [{ sender: userData._id, message: data.mess }];
        }
      });

      // set last mess of contact
      if (contactData && contactData?.idConversation) {
        setContact((prevState) => {
          let itemReviece = {};
          const filter = prevState.filter((item) => {
            if (item.idConversation == data.idConversation) {
              item.lastMessage = data.mess
                ? data.mess
                : `đã gửi ${listMessImg?.length} ảnh`;
              item.lastSend = userData._id;
              itemReviece = item;
            } else {
              return item;
            }
          });
          return [itemReviece, ...filter];
        });
      }
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getMessageByConversation({
        idConversation: contactData.idConversation,
      });
      if (response.status === 200) {
        setMessages(response.data);
      }
    };
    fetch();
  }, [contactData]);

  const handleSetBackground = (bg) => {
    handleChangeTheme(bg);
    setTableColr(false);
  };

  const handleTableColor = () => {
    tableColor ? setTableColr(false) : setTableColr(true);
  };

  const handleChangeMenuControl = (e) => {
    const name = e.target.getAttribute("name");
    setMenuControl((prevState) => {
      return {
        ...prevState,
        [name]: !prevState[name],
      };
    });
  };

  const handleSeenMess = () => {
    socket.current.emit("seen-mess", {
      idConversation: contactData.idConversation,
      idSeend: userData._id,
      idChatWith: contactData.idChatWith,
    });
  };

  const handleCheckImg = () => {
    // Set hover button send mess
    inputMessage.current.textContent.trim() !== "" || listMessImg?.length > 0
      ? setActiveIconSend(true)
      : setActiveIconSend(false);

    // Handle img
    let listImg = [];
    const childNodes = inputMessage.current.childNodes;
    childNodes?.forEach((item) => {
      if (item.nodeName == "IMG") {
        listImg = [...listImg, item.getAttribute("src")];
      }
    });
    setListMessImg(listImg);
  };

  const handleDelImg = (index) => {
    setListMessImg((prevState) => {
      if (index > 0 || index < prevState.length) {
        const filter = prevState.filter((item, index) => index !== index);
        return filter;
      }
    });
  };

  const handleButtonSendMess = (e) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      handleSendMess(e);
      setMenuControl({
        tableColor: false,
        tableIcon: false,
      });
      return;
    }
  };

  const handleGetIcon = (value) => {
    const input = inputMessage.current;
    input.innerHTML += value;

    input.focus();
    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <>
      <div className="container-containermess" onClick={handleSeenMess}>
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
                    {contactData.lastActive === "vừa xong" ? "" : " trước"}
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
            <HiOutlineUserGroup className="icon-header" />
            <CiSearch className="icon-header" />
            <IoCallOutline className="icon-header" />
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

                      {item.imgMess?.length > 0 && (
                        <ul className="list-imgs-mess flex">
                          {item.imgMess.map((item, index) => (
                            <li key={index}>
                              <img src={item} alt="" />
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-mess">{item.message}</p>
                      {index === messages.length - 1 && (
                        <div className="time-mess">
                          <p>
                            {new Date(item.updatedAt).getHours() < 10 && 0}
                            {new Date(item.updatedAt).getHours()}:
                            {new Date(item.updatedAt).getMinutes() < 10 && 0}
                            {new Date(item.updatedAt).getMinutes()}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="footer-chat">
          <div className="chat-input flex">
            <div className="flex">
              <div className="wrap-set-icon" ref={iconRef}>
                <RiEmojiStickerLine
                  className="icon-header"
                  name="tableIcon"
                  onClick={handleChangeMenuControl}
                />
                {menuControl.tableIcon && (
                  <div ref={tableIconRef} className="wrap-seticon">
                    <Icon handleGetIcon={handleGetIcon} />
                  </div>
                )}
              </div>
              <div ref={iconPictureRef} className="wrap-set-picture">
                <AiOutlinePicture className="icon-header" />
                {menuControl.tablePicture && (
                  <div ref={tablePictureRef}>
                    <p>Table picture o day</p>
                  </div>
                )}
              </div>
              <IoMdAttach className="icon-header" />
              <IoCameraOutline className="icon-header" />
              <MdOutlineContactMail className="icon-header" />
              <RiCalendarTodoFill className="icon-header" />

              <div className="wrap-setbackground" ref={iconBackgroundRef}>
                <TbBackground
                  name="tableColor"
                  onClick={handleChangeMenuControl}
                  className="icon-header"
                />
                {menuControl.tableColor && (
                  <div
                    ref={tableBackgroundRef}
                    className={`set-background ${
                      menuControl.tableColor ? "set-background-active" : ""
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
                )}
              </div>
            </div>
          </div>
          <form>
            <div className="chat-input-web">
              <ul className="list-img flex">
                {listMessImg?.map((item, index) => (
                  <li key={index}>
                    <img src={item} alt="" />
                    <p onClick={() => handleDelImg(index)}>
                      <IoMdClose />
                    </p>
                  </li>
                ))}
              </ul>
              <div
                className={`wrap-input-chat ${
                  listMessImg && listMessImg.length > 0 && "content-chat-height"
                }`}
                style={{
                  maxHeight:
                    listMessImg && listMessImg.length > 0 ? undefined : "170px",
                }}
              >
                {/* <input
                  type="text"
                  ref={inputMessage}
                  value={mess}
                  onChange={handleChangMess}
                  placeholder={`Nhập @, tin nhắn tới ${contactData.username}`}
                  onKeyDown={handleButtonSendMess}
                /> */}
                <div
                  contentEditable="true"
                  spellCheck="false"
                  className="contentEditable"
                  ref={inputMessage}
                  onInput={handleCheckImg}
                  onKeyDown={handleButtonSendMess}
                ></div>
              </div>
              <div className="flex">
                <AiOutlineSend
                  className={`icon-header icon-send-mess ${
                    activeIconSend && "activeIconSend"
                  }`}
                  style={{
                    color: "rgb(107 173 223)",
                    backgroundColor: "#dff3ff",
                  }}
                  onClick={handleSendMess}
                />
                <AiOutlineLike
                  className="icon-header"
                  onClick={(e) => handleSendMess(e, true)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default memo(ContainerMess);
