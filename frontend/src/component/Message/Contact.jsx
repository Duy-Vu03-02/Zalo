import React, { useEffect, useState, useContext, useRef, memo } from "react";
import { UserContext } from "../../Context/UserContext";
import { ContactContext } from "../../Context/ContactConext";
import "../../resource/style/Chat/contact.css";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { MdExpandMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoTriangle } from "react-icons/io5";
import { BsFillCameraFill } from "react-icons/bs";
import axios from "axios";

function Contact({ handleChangeContact }) {
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

  const [dataFr, setDataFr] = useState({
    username: "",
    show: false,
    data: null,
  });

  const [dataGr, setDataGr] = useState({
    username: null,
    listMember: [],
    showAvt: false,
    avatarImage: null,
  });
  const listAvatarGr = [
    "https://res.zaloapp.com/pc/avt_group/1_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/2_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/3_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/4_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/5_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/6_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/7_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/8_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/9_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/10_school.jpg",
    "https://res.zaloapp.com/pc/avt_group/11_school.jpg",
    "https://res.zaloapp.com/pc/avt_group/12_school.jpg",
  ];
  const { contact, setContact } = useContext(ContactContext);
  const { userData } = useContext(UserContext);
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

  const handleShowAddFriend = (value) => {
    setAddUser((prevState) => {
      return {
        ...prevState,
        friend: value,
      };
    });
  };

  const handleShowAddGroup = (value) => {
    setAddUser((prevState) => {
      return {
        ...prevState,
        group: value,
      };
    });
  };

  const handleAddMember = (value) => {
    setDataGr((prevState) => {
      if (prevState.listMember.length < 0) {
        return {
          ...prevState,
          listMember: [value],
        };
      } else {
        const check = prevState.listMember.includes(value);
        if (check) {
          const filter = prevState.listMember.filter((item) => item !== value);
          return {
            ...prevState,
            listMember: [...filter],
          };
        } else {
          return {
            ...prevState,
            listMember: [value, ...prevState.listMember],
          };
        }
      }
    });
  };

  const handleCreateGroup = () => {
    handleShowAddGroup(false);
    setContact((prevState) => {
      return [dataGr, ...prevState];
    });
    setDataGr({
      username: null,
      listMember: [],
      showAvt: false,
      avatarImage: null,
    });
  };

  const handleShowAvatarGr = (value) => {
    setDataGr((prevState) => {
      return {
        ...prevState,
        showAvt: value,
      };
    });
  };

  const handleChoiceAvatarGr = (value) => {
    setDataGr((prevState) => {
      return {
        ...prevState,
        avatarImage: value,
      };
    });
  };

  const handleChangURl = (e) => {
    setDataGr((prevState) => {
      return {
        ...prevState,
        avatarImage: e.target.value,
      };
    });
  };

  const handleSaveAvatarGr = () => {
    if (dataGr.avatarImage !== null) {
      handleShowAvatarGr(false);
    }
  };
  const handleChangeNameGr = (e) => {
    setDataGr((prevState) => {
      return {
        ...prevState,
        username: e.target.value,
      };
    });
  };
  const handleChangePhone = (e) => {
    setDataFr((prevState) => {
      return {
        ...prevState,
        username: e.target.value,
      };
    });
  };
  const handleFineUserByPhone = async () => {
    if (dataFr.username !== "") {
      const url = "http://localhost:8080/user/getphone";
      const response = await axios.post(url, {
        phone: dataFr.username,
        id: userData._id,
      });
      if (response.status === 200) {
        setDataFr({
          username: "",
          show: true,
          data: response.data,
        });
        console.log(response);
      } else {
        setDataFr((prevState) => {
          return { ...prevState, data: null };
        });
      }
    }
  };

  const handleChange = () => {};
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
                  onClick={() => handleShowAddFriend(true)}
                />
                <HiOutlineUsers
                  className="icon-user-contact"
                  onClick={() => handleShowAddGroup(true)}
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
                        onClick={() => handleShowAddFriend(false)}
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
                          <input
                            type="text"
                            value={dataFr.username}
                            onChange={handleChangePhone}
                            placeholder="Số điện thoại"
                          />
                        </div>
                      </div>
                      <div className="recent-result">
                        <p>Kết quả {dataFr.show !== null ? "" : "gần nhất"}</p>
                      </div>
                      {dataFr.data !== null && (
                        <div className="wrap-result-phone flex">
                          <div className="flex">
                            <img src={dataFr.data.avatarImage} alt="" />
                            <div>
                              <p className="username ">
                                {dataFr.data.username}
                              </p>
                              <p className="phone">{dataFr.data.phone}</p>
                            </div>
                          </div>
                          <div>
                            <button>Kết bạn</button>
                          </div>
                        </div>
                      )}
                      <div className="btn-find-friend flex">
                        <button onClick={() => handleShowAddFriend(false)}>
                          Hủy
                        </button>
                        <button
                          style={{ backgroundColor: "#0068ff", color: "white" }}
                          onClick={handleFineUserByPhone}
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {dataGr.showAvt && (
                <div className="screen-mask" style={{ zIndex: 1001 }}>
                  <div className="choice-avatar-gr">
                    <div className="header-add-friend flex">
                      <p>Cập nhật ảnh đại diện</p>
                      <IoMdClose
                        className="btn-close"
                        onClick={() => handleShowAvatarGr(false)}
                      />
                    </div>
                    <div className="input-number-group">
                      <CiSearch className="icon-search" />
                      <input
                        type="text"
                        placeholder="Nhập url hình ảnh"
                        value={dataGr.avatarImage}
                        onChange={handleChangURl}
                      />
                    </div>
                    <div>
                      <ul className="ex-avatar flex">
                        {listAvatarGr?.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => handleChoiceAvatarGr(item)}
                          >
                            <img
                              src={item}
                              alt=""
                              className={
                                item === dataGr.avatarImage
                                  ? "ex-avatar-choice"
                                  : ""
                              }
                            />
                          </li>
                        ))}
                      </ul>
                      <div
                        className="btn-find-friend flex"
                        style={{ position: "relative" }}
                      >
                        <button onClick={() => handleShowAvatarGr(false)}>
                          Hủy
                        </button>
                        <button
                          onClick={handleSaveAvatarGr}
                          style={{ backgroundColor: "#0068ff", color: "white" }}
                        >
                          Cập nhật
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
                        onClick={() => handleShowAddGroup(false)}
                      />
                    </div>
                    <div className="add-by-phone">
                      <div className="phone-group flex">
                        {dataGr.avatarImage ? (
                          <img
                            src={dataGr.avatarImage}
                            onClick={() => handleShowAvatarGr(true)}
                          />
                        ) : (
                          <BsFillCameraFill
                            className="avatar-group"
                            onClick={() => handleShowAvatarGr(true)}
                          />
                        )}
                        <div className="input-number group">
                          <input
                            type="text"
                            placeholder="Nhập tên nhóm"
                            onChange={handleChangeNameGr}
                            value={dataGr.username}
                          />
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
                            <li
                              key={index}
                              onClick={() => handleAddMember(item)}
                            >
                              <div className="contact-detial-conversation flex">
                                <div className="flex">
                                  <div className="checkbox-add">
                                    <input
                                      type="checkbox"
                                      id={`checkbox ${index}`}
                                      checked={dataGr.listMember.some(
                                        (member) => {
                                          return item._id === member._id;
                                        }
                                      )}
                                      onChange={handleChange}
                                    />
                                    <label for={`checkbox ${index}`}></label>
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
                        <button onClick={() => handleShowAddGroup(false)}>
                          Hủy
                        </button>
                        <button
                          onClick={handleCreateGroup}
                          style={{
                            backgroundColor: "#0068ff",
                            width: "125px",
                            color: "white",
                          }}
                        >
                          Tạo nhóm{" "}
                          {dataGr.listMember.length < 1
                            ? ""
                            : ` (${dataGr.listMember.length})`}
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

export default memo(Contact);
