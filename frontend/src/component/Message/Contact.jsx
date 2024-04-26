import React, { useEffect, useState, useContext } from "react";
import { ContactContext } from "../../Context/ContactConext";
import "../../resource/style/Chat/contact.css";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { MdExpandMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";

export default function Contact({ handleChangeContact }) {
  const [textSearch, setTextSearch] = useState("");
  const [allMessActive, setAllMessActive] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const { contact } = useContext(ContactContext);

  useEffect(() => {
    if (contact !== null) {
      setConversationList(contact);
    }
  }, [contact]);

  const handleChangeTextSearch = (e) => {
    setTextSearch(e.target.value);
  };
  const handleChangeShowMess = () => {
    allMessActive ? setAllMessActive(false) : setAllMessActive(true);
  };

  return (
    <>
      <div className="contact-container-contact">
        <div className="contact-contact-search flex">
          <div className="contact-group-search flex">
            <CiSearch className="icon-search" />
            <input
              type="text"
              value={textSearch}
              onChange={handleChangeTextSearch}
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="contact-group-add-user flex">
            <HiOutlineUser className="icon-user-contact" />
            <HiOutlineUsers className="icon-user-contact" />
          </div>
        </div>
        <div className="contact-wrap-conversation">
          <div className="contact-filter-converstation flex">
            <div className="contact-left-filter">
              <div className="flex">
                <p
                  className={`${allMessActive ? "all-mess-active" : ""}`}
                  onClick={handleChangeShowMess}
                >
                  Tất cả
                </p>
                <p
                  className={`${allMessActive ? "" : "all-mess-active"}`}
                  onClick={handleChangeShowMess}
                >
                  Chưa đọc
                </p>
                <hr
                  className={`contact-hr-left-filter ${
                    allMessActive ? "" : "contact-hr-left-filter-active"
                  }`}
                />
              </div>
            </div>
            <div className="contact-right-filter">
              <div className="contact- flex">
                <div className="contact-classification-filter flex">
                  <p>Phân loại</p>
                  <MdExpandMore className="icon-filter" />
                </div>
                <div className="contact-more-filter">
                  <IoIosMore className="icon-filter" />
                </div>
              </div>
            </div>
          </div>
          <div className="contact-listConversation">
            <ul>
              {conversationList &&
                conversationList.map((data, index) => (
                  <li key={index} onClick={() => handleChangeContact(data)}>
                    <div className="contact-detial-conversation flex">
                      <div className="flex">
                        <div className="contact-avatar-friend">
                          <img src={data.avatarImage} alt="" />
                        </div>
                        <div className="contact-overview-mess">
                          <h3>{data.username}</h3>
                          <p>A Âm và Khởi Nguyên chân thần</p>
                        </div>
                      </div>
                      <div className="contact-last-onl">
                        <p>3 giờ</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
