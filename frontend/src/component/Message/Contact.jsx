import React, { useEffect, useState } from "react";
import "../../resource/style/Chat/contact.css";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { MdExpandMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";

export default function Contact() {
  const [textSearch, setTextSearch] = useState("");
  const [allMessActive, setAllMessActive] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const [statusShow, setStatusShow] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      await axios
        .post("http://127.0.0.1:8080/user/getfriend")
        .then((response) => {
          if (response.status === 200) {
            setConversationList(response.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchFriend();
  }, []);

  useEffect(() => {
    const showFriend = () => {
      setStatusShow(true);
    };
    showFriend();
  }, [conversationList]);

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
              {statusShow &&
                conversationList.map((data, index) => (
                  <li key={index}>
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
