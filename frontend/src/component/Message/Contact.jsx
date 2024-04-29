import React, { useEffect, useState, useContext, useRef } from "react";
import { ContactContext } from "../../Context/ContactConext";
import "../../resource/style/Chat/contact.css";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { MdExpandMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import axios from "axios";

export default function Contact({ handleChangeContact }) {
  const [textSearch, setTextSearch] = useState("");
  const [isSearch, setIsSearch] = useState({
    state: false,
    recent: false,
    response: false,
  });
  const [dataSearch, setDataSearch] = useState({
    recent: null,
    response: null,
  });
  const [allMessActive, setAllMessActive] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const { contact } = useContext(ContactContext);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const local = localStorage.getItem("userSearch");
    if (local !== null) {
      setDataSearch((prevState) => {
        return {
          ...prevState,
          recent: JSON.parse(local),
        };
      });
      setIsSearch((prevState) => {
        return {
          ...prevState,
          recent: true,
          response: false,
        };
      });
    }
  }, []);

  useEffect(() => {
    if (contact !== null) {
      setConversationList(contact);
    }
  }, [contact]);
  useEffect(() => {
    if (textSearch === "") {
      setIsSearch((prevState) => {
        return {
          ...prevState,
          recent: true,
        };
      });
    } else {
      setIsSearch((prevState) => {
        return {
          ...prevState,
          recent: false,
        };
      });
    }
  }, [textSearch]);

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
          const temp = dataSearch.recent;
          let newTemp = [];
          if (temp !== null && Array.isArray(temp)) {
            const filterNewTemp = temp.filter(
              (item) => item._id !== response.data._id
            );
            newTemp = [...filterNewTemp, response.data];
          } else {
            newTemp = [response.data];
          }
          localStorage.setItem("userSearch", JSON.stringify(newTemp));
          setDataSearch((prevState) => {
            return {
              recent: newTemp,
              response: [response.data],
            };
          });
          setIsSearch((prevState) => {
            return {
              state: true,
              recent: false,
              response: true,
            };
          });
        } else {
          setIsSearch((prevState) => {
            return {
              ...prevState,
              response: false,
            };
          });
        }
      }, 500);
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
      return { ...prevState, state: value };
    });
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
              onClick={() => handleChangeIsSearch(true)}
            />
          </div>
          <div className="contact-group-add-user flex">
            <HiOutlineUser className="icon-user-contact" />
            <HiOutlineUsers className="icon-user-contact" />
          </div>
        </div>
        {isSearch.state ? (
          <div className="recent-search">
            <ul className="wrap-recent-search">
              {isSearch.recent && (
                <div>
                  <p style={{ marginLeft: "20px", fontWeight: "500" }}>
                    Tìm gần đây
                  </p>
                  <div className="wrap-result-search">
                    {isSearch.recent &&
                      Array.isArray(dataSearch.recent) &&
                      dataSearch.recent !== null &&
                      dataSearch.recent.map((item, index) => (
                        <li key={index}>
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
                  <div>
                    <div className="contact-left-filter">
                      <div className="flex">
                        <p
                          className={`${
                            allMessActive ? "all-mess-active" : ""
                          }`}
                          onClick={handleChangeShowMess}
                        >
                          Tất cả
                        </p>
                        <p
                          className={`${
                            allMessActive ? "" : "all-mess-active"
                          }`}
                          onClick={handleChangeShowMess}
                        >
                          Liên hệ
                        </p>
                        <hr
                          className={`contact-hr-left-filter ${
                            allMessActive ? "" : "contact-hr-left-filter-active"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="wrap-result-search">
                    {isSearch.response &&
                      dataSearch.response !== null &&
                      Array.isArray(dataSearch.response) &&
                      dataSearch.response.map((item, index) => (
                        <li key={index}>
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
        )}
      </div>
    </>
  );
}
