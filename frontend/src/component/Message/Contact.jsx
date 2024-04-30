import React, { useEffect, useState, useContext, useRef } from "react";
import { ContactContext } from "../../Context/ContactConext";
import "../../resource/style/Chat/contact.css";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { MdExpandMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoTriangle } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";

import axios from "axios";

export default function Contact({ handleChangeContact }) {
  const [textSearch, setTextSearch] = useState("");
  const [isSearch, setIsSearch] = useState({
    state: false,
    recent: true,
    response: false,
  });
  const [dataSearch, setDataSearch] = useState({
    recent: [],
    response: [],
  });
  const [addUser, setAddUser] = useState({
    friend: false,
    group: false,
  });
  const [allMessActive, setAllMessActive] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const { contact } = useContext(ContactContext);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const local = localStorage.getItem("user-search");
    if (local !== null) {
      setDataSearch((prevState) => {
        return {
          ...prevState,
          recent: JSON.parse(local),
        };
      });
    }
  }, []);

  useEffect(() => {
    if (textSearch === "") {
      clearTimeout(searchTimeout.current);
      setIsSearch((prevState) => {
        return {
          ...prevState,
          recent: true,
          response: false,
        };
      });
    }
  }, [textSearch]);

  useEffect(() => {
    if (contact !== null) {
      setConversationList(contact);
    }
  }, [contact]);

  const handleSearchDb = (value) => {
    if (value !== "") {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(async () => {
        const data = {
          username: value,
        };
        const response = await axios.post(
          "http://localhost:8080/user/getfriend",
          data
        );
        if (response.status === 200) {
          setDataSearch((prevState) => {
            return {
              ...prevState,
              response: response.data,
            };
          });
        } else {
          setDataSearch((prevState) => {
            return {
              ...prevState,
              response: [],
            };
          });
        }
        setIsSearch((prevState) => {
          return {
            ...prevState,
            response: true,
            recent: false,
          };
        });
      }, 300);
    }
  };
  const handleChangeTextSearch = (e) => {
    let data = e.target.value;

    setTextSearch(data);

    handleSearchDb(data);
  };
  const handleChangeShowMess = () => {
    allMessActive ? setAllMessActive(false) : setAllMessActive(true);
  };
  const handleChangeIsSearch = (value) => {
    setIsSearch((prevState) => {
      return {
        ...prevState,
        state: value,
      };
    });
    if (!value) {
      setTextSearch("");
    }
  };
  const handleChoiceContact = (value) => {
    storeLocal(value);
    handleChangeContact(value);
    setIsSearch((prevState) => {
      return {
        ...prevState,
        state: false,
      };
    });
    setTextSearch("");
  };
  const storeLocal = (value) => {
    setDataSearch((prevState) => {
      return {
        ...prevState,
        recent: [value, ...prevState.recent],
      };
    });
    localStorage.setItem("user-search", JSON.stringify(dataSearch.recent));
  };

  const handleAddFriend = (value) => {
    setAddUser((prevState) => {
      return {
        ...prevState,
        friend: value,
      };
    });
  };
  const handleAddGroup = (value) => {
    setAddUser((prevState) => {
      return {
        ...prevState,
        group: value,
      };
    });
  };

  return (
    <>
      <div className="contact-container-contact">
        <div className="contact-contact-search ">
          <div className="flex">
            <div className="contact-group-search flex">
              <CiSearch className="icon-search" />
              <input
                type="text"
                value={textSearch}
                onChange={handleChangeTextSearch}
                placeholder="Tìm kiếm"
                onClick={() => handleChangeIsSearch(true)}
              />
            </div>
            {isSearch.state ? (
              <div className="btn-close-search">
                <p onClick={() => handleChangeIsSearch(false)}>Đóng</p>
              </div>
            ) : (
              <div className="contact-group-add-user flex">
                <HiOutlineUser
                  className="icon-user-contact"
                  onClick={() => handleAddFriend(true)}
                />
                <HiOutlineUsers
                  className="icon-user-contact"
                  onClick={() => handleAddGroup(true)}
                />
              </div>
            )}
            <div className="add-friend-group">
              {addUser.friend && (
                <div className="screen-mask">
                  <div className="wrap-add">
                    <div className="header-add-friend flex">
                      <p>Thêm bạn</p>
                      <IoMdClose
                        className="btn-close"
                        onClick={() => handleAddFriend(false)}
                      />
                    </div>
                    <div className="add-by-phone">
                      <div className="phone-friend flex">
                        <div className="img-phone flex">
                          <span></span>
                          <p>(+84)</p>
                          <IoTriangle
                            style={{
                              color: "#7589a3",
                              fontSize: "11px",
                              transform: "rotate(60deg)",
                              margin: "auto 10px",
                            }}
                          />
                        </div>
                        <div className="input-number">
                          <input type="text" placeholder="Số điện thoại" />
                        </div>
                      </div>
                      <div className="recent-result">
                        <p>Kết quả gần nhất</p>
                      </div>
                      <div className="btn-find-friend flex">
                        <button onClick={() => handleAddFriend(false)}>
                          Hủy
                        </button>
                        <button
                          style={{ backgroundColor: "#0068ff", color: "white" }}
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {addUser.group && (
                <div className="screen-mask">
                  <div className="wrap-add wrap-add-group">
                    <div className="header-add-friend flex">
                      <p>Tạo nhóm</p>
                      <IoMdClose
                        className="btn-close"
                        onClick={() => handleAddGroup(false)}
                      />
                    </div>
                    <div className="add-by-phone">
                      <div className="phone-group flex">
                        <IoCameraOutline className="avatar-group" />
                        <div className="input-number group">
                          <input type="text" placeholder="Nhập tên nhóm" />
                        </div>
                      </div>
                      <div className="input-number-group">
                        <CiSearch className="icon-search" />
                        <input
                          type="text"
                          placeholder="Nhập tên, số điện thoại, hoặc danh sách số"
                        />
                      </div>
                      <div className="list-contact">
                        {contact &&
                          contact.map((item, index) => (
                            <li key={index}>
                              <div className="contact-detial-conversation flex">
                                <div className="flex">
                                  <div className="checkbox-add">
                                    <input type="checkbox" id="index" />
                                    <label for="checkbox"></label>
                                  </div>
                                  <div className="contact-avatar-friend">
                                    <img src={item.avatarImage} alt="" />
                                  </div>
                                  <div className="contact-overview-mess">
                                    <h3>{item.username}</h3>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                      </div>
                      <div className="btn-find-friend flex">
                        <button onClick={() => handleAddGroup(false)}>
                          Hủy
                        </button>
                        <button
                          style={{ backgroundColor: "#0068ff", color: "white" }}
                        >
                          Tạo nhóm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {(!isSearch.state || (isSearch.response && !isSearch.recent)) && (
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
                    {!isSearch.state ? "Chưa đọc" : "Liên hệ"}
                  </p>
                  <hr
                    className={`contact-hr-left-filter ${
                      allMessActive ? "" : "contact-hr-left-filter-active"
                    }`}
                  />
                </div>
              </div>
              {!isSearch.state ? (
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
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        {isSearch.state ? (
          <div className="recent-search">
            <ul className="wrap-recent-search">
              {isSearch.recent && (
                <div>
                  <p style={{ margin: "10px 0 0 20px", fontWeight: "500" }}>
                    Tìm gần đây
                  </p>
                  <div className="wrap-result-search">
                    {isSearch.recent &&
                      dataSearch.recent !== null &&
                      dataSearch.recent.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleChoiceContact(item)}
                        >
                          <div className="flex">
                            <img src={item.avatarImage} alt="" />
                            <p>{item.username}</p>
                          </div>
                        </li>
                      ))}
                  </div>
                </div>
              )}

              {isSearch.response && (
                <div>
                  <div className="wrap-result-search">
                    {isSearch.response &&
                      dataSearch.response !== null &&
                      Array.isArray(dataSearch.response) &&
                      dataSearch.response.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleChoiceContact(item)}
                        >
                          <div className="flex">
                            <img src={item.avatarImage} alt="" />
                            <p>{item.username}</p>
                          </div>
                        </li>
                      ))}
                  </div>
                </div>
              )}
            </ul>
          </div>
        ) : (
          <div className="contact-wrap-conversation">
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
        )}
      </div>
    </>
  );
}
