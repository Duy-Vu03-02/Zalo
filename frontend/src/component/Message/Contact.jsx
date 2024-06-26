import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  memo,
  useLayoutEffect,
} from "react";
import { UserContext } from "../../Context/UserContext";
import { ContactContext } from "../../Context/ContactConext";
import "../../resource/style/Chat/contact.css";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdExpandMore, MdMore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoTriangle } from "react-icons/io5";
import { BsFillCameraFill } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import MenuContact from "../AddressBook/MenuContact";
import { IconBase } from "react-icons/lib";
import {
  createGroup,
  crudFriend,
  delConversationById,
  getFriendByName,
  getUserByPhone,
} from "../../util/api";

function Contact({
  handleChangeContact,
  showPageAddressBook,
  handleChangeSoftContact,
  disableContainer,
}) {
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
  const [conversationListNotSeen, setConversationListNotSeen] = useState([]);

  const [dataUserPhone, setDataUserPhone] = useState({
    username: "",
    show: false,
    data: null,
    state: null,
    cancel: null,
    unfriend: null,
    checkId: null,
  });
  const [dataCreateGr, setDataCreateGr] = useState({
    username: null,
    listMember: [],
    showAvt: false,
    avatar: null,
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
  const {
    contact,
    setContact,
    fetchConversation,
    currentConversation,
    setCurrentConversation,
  } = useContext(ContactContext);
  const { userData, socket } = useContext(UserContext);
  const searchTimeout = useRef(null);
  const conversationAvticve = useRef(null);

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
    if (socket.current) {
      socket.current.on("received-soft-conversation", (data) => {
        setContact((prevContact) => [data, ...prevContact]);
        setConversationList((prevContact) => [data, ...prevContact]);
      });
      socket.current.on("received-soft-contact-conversation", (data) => {
        setContact((prevContact) => [data, ...prevContact]);
        handleChangeContact({ ...data, userId: userData._id });
        conversationAvticve.current = data._id;
      });
      socket.current.on("received-soft-mess", (data) => {
        data.idChatWith = data._id;
        handleChangeSoftContact(data);
      });
      socket.current.on("recieve-lastmess", (data) => {
        if (contact && contact.length > 0) {
          setContact((prevState) => {
            let itemReviece = {};
            const filter = prevState.filter((item) => {
              if (item.idConversation == data.idConversation) {
                item.lastMessage = data.lastMessage;
                item.lastSend = data.lastSend;
                itemReviece = item;
              } else {
                return item;
              }
            });
            return [itemReviece, ...filter];
          });
        }
      });
      socket.current.on("recieve-count-seen", (data) => {
        if (contact && contact.length > 0) {
          setContact((prevState) => {
            const filter = prevState.map((item) => {
              if (item.idConversation == data.idConversation) {
                item.countMessseen = data.countMessseen;
              }
              return item;
            });
            return filter;
          });
        }
      });
    }
    if (socket.current) {
      return () => {
        socket.current.off("received-soft-conversation");
        socket.current.off("received-soft-contact-conversation");
        socket.current.off("received-soft-mess");
        socket.current.off("recieve-lastmess");
        socket.current.off("recieve-count-seen");
      };
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-crud-fr", (data) => {
        if (dataUserPhone.data?._id == data.id) {
          if (data.refreshCoversation) {
            fetchConversation();
          }
          setDataUserPhone((prevState) => {
            return {
              ...prevState,
              state: data.mess,
              show: prevState.state !== null ? true : false,
              cancel: data.cancel ? data.cancel : null,
              unfriend: data.unfriend ? data.unfriend : null,
              // checkId: data.id,
            };
          });
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("recieve-crud-fr");
      }
    };
  }, [dataUserPhone]);

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
      if (socket.current) {
        socket.current.on("received-soft-user", (data) => {
          data.idChatWith = data._id;
          handleChangeSoftContact(data);
        });
        socket.current.on("recieve-lastmess", (data) => {
          if (contact && contact.length > 0) {
            setContact((prevState) => {
              let itemReviece = {};
              const filter = prevState.filter((item) => {
                if (item?.idConversation == data?.idConversation) {
                  item.lastMessage = data.lastMessage;
                  item.lastSend = data.lastSend;
                  itemReviece = item;
                } else {
                  return item;
                }
              });
              return [itemReviece, ...filter];
            });
          }
        });
        socket.current.on("recieve-count-seen", (data) => {
          if (contact && contact.length > 0) {
            setContact((prevState) => {
              const filter = prevState.map((item) => {
                if (item.idConversation == data.idConversation) {
                  item.countMessseen = data.countMessseen;
                }
                return item;
              });
              return filter;
            });
          }
        });
      }
    }
    if (socket.current) {
      return () => {
        socket.current.off("received-soft-mess");
        socket.current.off("recieve-lastmess");
        socket.current.off("recieve-count-seen");
      };
    }
  }, [contact]);

  const handleSearchDb = (value) => {
    if (value !== "") {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(async () => {
        const response = await getFriendByName({
          friendName: value,
          userId: userData._id,
        });
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

  const handleChangeShowMessSeen = (value) => {
    setAllMessActive(value);
    if (!value) {
      if (conversationList?.length > 0) {
        const filterMessSeen = conversationList.filter((item) => {
          if (item.countMessseen > 0 && item.lastSend !== userData._id) {
            return item;
          }
        });
        setConversationListNotSeen(filterMessSeen);
      } else {
        setConversationListNotSeen(null);
      }
    }
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
    handleChangeContact({ ...value, userId: userData._id });
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
      const filterRecent = prevState.recent.filter((x) => x._id !== value._id);
      return {
        response: prevState.response,
        recent: [value, ...filterRecent],
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

    if (!value) {
      setDataUserPhone({
        username: "",
        show: false,
        data: null,
        state: null,
        cancel: null,
      });
    }
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
    setDataCreateGr((prevState) => {
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

  const handleCreateGroup = async () => {
    handleShowAddGroup(false);

    const response = await createGroup({
      groupName: dataCreateGr.username,
      listMember: [...dataCreateGr.listMember, userData._id],
      avatarGroup: dataCreateGr.avatar,
    });
    if (response.status === 200) {
      setContact((prevState) => {
        return [
          {
            _id: response.data._id,
            groupName: response.data.groupName,
            avatarGroup: response.data.avatarGroup,
            type: response.data.type,
            lastMessage: response.data.lastMessage,
            member: response.data.member,
          },
          ...prevState,
        ];
      });
    }
    setDataCreateGr({
      username: null,
      listMember: [],
      showAvt: false,
      avatar: null,
    });
  };

  const handleShowAvatarGr = (value) => {
    setDataCreateGr((prevState) => {
      return {
        ...prevState,
        showAvt: value,
      };
    });
  };

  const handleChoiceAvatarGr = (value) => {
    setDataCreateGr((prevState) => {
      return {
        ...prevState,
        avatar: value,
      };
    });
  };

  const handleChangURl = (e) => {
    setDataCreateGr((prevState) => {
      return {
        ...prevState,
        avatar: e.target.value,
      };
    });
  };

  const handleSaveAvatarGr = () => {
    if (dataCreateGr.avatar !== null) {
      handleShowAvatarGr(false);
    }
  };
  const handleChangeNameGr = (e) => {
    setDataCreateGr((prevState) => {
      return {
        ...prevState,
        username: e.target.value,
      };
    });
  };
  const handleChangePhone = (e) => {
    setDataUserPhone((prevState) => {
      return {
        ...prevState,
        username: e.target.value,
      };
    });
  };
  const handleFindUserByPhone = async () => {
    if (dataUserPhone.username !== "") {
      const response = await getUserByPhone({
        phone: dataUserPhone.username,
        id: userData._id,
      });
      if (response.status === 200) {
        setDataUserPhone({
          username: "",
          show: true,
          data: response.data.data,
          state: response.data.state,
          cancel: response.data.cancel ? response.data.cancel : null,
          unfriend: response.data.unfriend ? response.data.unfriend : null,
        });
      } else {
        setDataUserPhone({
          username: "",
          show: false,
          data: null,
          state: response.data.state,
          cancel: null,
          unfriend: null,
        });
      }
    }
  };
  const handleCRUDFriend = async (friendId, state) => {
    const response = await crudFriend({
      userId: userData._id,
      friendId: friendId,
      state: state,
    });

    if (response.status === 200) {
      socket.current.emit("crud-friend", {
        userId: userData._id,
        friendId: friendId,
        state: state,
      });
    }
  };
  const handleChangeConversationActive = (data) => {
    conversationAvticve.current = data.idConversation;
  };

  const handleDelConversation = async (id) => {
    if (id === currentConversation.idConversation) {
      disableContainer();
    }

    const response = await delConversationById({ idConversation: id });
    if (response.status === 200) {
      setContact((prevContact) => {
        const newContact = prevContact.filter(
          (item) => item.idConversation !== id
        );
        return newContact;
      });
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
                <HiOutlineUserPlus
                  className="icon-user-contact"
                  onClick={() => handleShowAddFriend(true)}
                />
                <HiOutlineUserGroup
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
                            value={dataUserPhone.username}
                            onChange={handleChangePhone}
                            placeholder="Số điện thoại"
                          />
                        </div>
                      </div>
                      <div className="recent-result">
                        <p>
                          Kết quả{" "}
                          {dataUserPhone.show !== null ? "" : "gần nhất"}
                        </p>
                        {dataUserPhone.state &&
                          dataUserPhone.state.length > 20 && (
                            <p>{dataUserPhone.state}</p>
                          )}
                      </div>
                      {dataUserPhone.data !== null && (
                        <div className="wrap-result-phone flex">
                          <div className="flex" style={{ maxWidth: "200px" }}>
                            <img src={dataUserPhone.data.avatar} alt="" />
                            <div>
                              <p className="username ">
                                {dataUserPhone.data.username}
                              </p>
                              <p className="phone">
                                {dataUserPhone.data.phone}
                              </p>
                            </div>
                          </div>
                          <div>
                            {dataUserPhone.cancel &&
                              dataUserPhone.cancel !== null && (
                                <button
                                  style={{
                                    backgroundColor: "#eaedf0",
                                    color: "black",
                                  }}
                                  onClick={() =>
                                    handleCRUDFriend(
                                      dataUserPhone.data._id,
                                      dataUserPhone.cancel
                                    )
                                  }
                                >
                                  {dataUserPhone.cancel}
                                </button>
                              )}
                            {dataUserPhone.unfriend &&
                              dataUserPhone.unfriend !== null && (
                                <button
                                  style={{
                                    backgroundColor: "#eaedf0",
                                    color: "black",
                                  }}
                                  onClick={() =>
                                    handleCRUDFriend(
                                      dataUserPhone.data._id,
                                      dataUserPhone.unfriend
                                    )
                                  }
                                >
                                  {dataUserPhone.unfriend}
                                </button>
                              )}
                            <button
                              onClick={() =>
                                handleCRUDFriend(
                                  dataUserPhone.data._id,
                                  dataUserPhone.state
                                )
                              }
                            >
                              {dataUserPhone?.state}
                            </button>
                          </div>
                        </div>
                      )}
                      {dataUserPhone.show &&
                        dataUserPhone.checkId == dataUserPhone.data._id && (
                          <div className="recent-result">
                            <p>
                              {dataUserPhone.data === null &&
                                dataUserPhone.state &&
                                `${dataUserPhone.state}`}
                            </p>
                          </div>
                        )}
                      <div className="btn-find-friend flex">
                        <button onClick={() => handleShowAddFriend(false)}>
                          Hủy
                        </button>
                        <button
                          style={{ backgroundColor: "#0068ff", color: "white" }}
                          onClick={handleFindUserByPhone}
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {dataCreateGr.showAvt && (
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
                        value={dataCreateGr.avatar}
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
                                item === dataCreateGr.avatar
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
                        {dataCreateGr.avatar ? (
                          <img
                            src={dataCreateGr.avatar}
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
                            value={dataCreateGr.username}
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
                              onClick={() => handleAddMember(item.idChatWith)}
                            >
                              <div className="contact-detial-conversation flex">
                                <div className="flex">
                                  <div className="checkbox-add">
                                    <input
                                      type="button"
                                      className={`${
                                        dataCreateGr.listMember.includes(
                                          item.idChatWith
                                        )
                                          ? "active"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  <div className="contact-avatar-friend">
                                    <img src={item.avatar} alt="" />
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
                          {dataCreateGr.listMember.length < 1
                            ? ""
                            : ` (${dataCreateGr.listMember.length})`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {((!showPageAddressBook && !isSearch.state) ||
            (isSearch.response && !isSearch.recent)) && (
            <div className="contact-filter-converstation flex">
              <div className="contact-left-filter">
                <div className="flex">
                  <p
                    className={`${allMessActive ? "all-mess-active" : ""}`}
                    onClick={() => handleChangeShowMessSeen(true)}
                  >
                    Tất cả
                  </p>
                  <div>
                    {!isSearch.state ? (
                      <p
                        onClick={() => handleChangeShowMessSeen(false)}
                        className={`${allMessActive ? "" : "all-mess-active"}`}
                      >
                        Chưa đọc
                      </p>
                    ) : (
                      <p
                        // onClick={() => handleChangeShowMessSeen(true)}
                        className={`${allMessActive ? "" : "all-mess-active"}`}
                      >
                        Liên hệ
                      </p>
                    )}
                  </div>
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
                  <p style={{ margin: "10px 0 10px 20px", fontWeight: "500" }}>
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
                            <img src={item.avatar} alt="" />
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
                            <img src={item.avatar} alt="" />
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
          !showPageAddressBook && (
            <div className="contact-wrap-conversation">
              <div className="contact-listConversation">
                {allMessActive ? (
                  <ul>
                    {conversationList &&
                      conversationList.map((data, index) => (
                        <li
                          className={
                            data?.idConversation === conversationAvticve.current
                              ? "conversation-active "
                              : ""
                          }
                          key={index}
                          onClick={() => {
                            handleChangeContact(data);
                            handleChangeConversationActive(data);
                          }}
                        >
                          <div className="contact-detial-conversation flex">
                            <div className="flex">
                              <div className="contact-avatar-friend">
                                <img
                                  src={
                                    data?.type === "single"
                                      ? data?.avatar
                                      : data?.avatarGroup
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="contact-overview-mess">
                                <h3>
                                  {data.type == "single"
                                    ? data.username
                                    : data.groupName}
                                </h3>
                                {data.type == "single" ? (
                                  <p>
                                    {data.lastMessage
                                      ? `${
                                          data.lastSend == userData._id
                                            ? "Bạn: "
                                            : `${data.username}: `
                                        } ${data.lastMessage}`
                                      : `Gửi lời chào đến ${data.username}`}{" "}
                                  </p>
                                ) : (
                                  <p>
                                    {data.lastMessage
                                      ? data.lastMessage
                                      : `Gửi lời chào đến ${data.groupName}`}{" "}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="contact-last-onl flex">
                              <p>
                                {data.lastActive === "Active" ? (
                                  <RxDotFilled
                                    style={{
                                      fontSize: "20px",
                                      color: "#30a04b",
                                    }}
                                  />
                                ) : (
                                  data.lastActive
                                )}
                              </p>

                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                style={{
                                  display: "none",
                                }}
                              >
                                <IoIosMore className="icon-more-conversation" />
                                <div
                                  className="box-del-conversation"
                                  key={index}
                                  onClick={(e) => {
                                    handleDelConversation(data.idConversation);
                                  }}
                                >
                                  <p>Xóa hội thoại</p>
                                </div>
                              </div>
                              {parseInt(data.countMessseen) > 0 &&
                                data.lastSend !== userData._id && (
                                  <div
                                    className="wrap-count-seen"
                                    style={{ display: "block !important" }}
                                  >
                                    <p className="count-seen">
                                      {parseInt(data.countMessseen)}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <ul>
                    {conversationListNotSeen &&
                      conversationListNotSeen.map((data, index) => (
                        <li
                          key={index}
                          onClick={() => handleChangeContact(data)}
                        >
                          <div className="contact-detial-conversation flex">
                            <div className="flex">
                              <div className="contact-avatar-friend">
                                <img
                                  src={
                                    data.type === "single"
                                      ? data.avatar
                                      : data.avatarGroup
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="contact-overview-mess">
                                <h3>
                                  {data.type == "single"
                                    ? data.username
                                    : data.groupName}
                                </h3>
                                {data.type == "single" ? (
                                  <p>
                                    {data.lastMessage
                                      ? `${
                                          data.lastSend == userData._id
                                            ? "Bạn: "
                                            : `${data.username}: `
                                        } ${data.lastMessage}`
                                      : `Gửi lời chào đến ${data.username}`}{" "}
                                  </p>
                                ) : (
                                  <p>
                                    {data.lastMessage
                                      ? data.lastMessage
                                      : `Gửi lời chào đến ${data.groupName}`}{" "}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="contact-last-onl flex">
                              <p>
                                {data.lastActive === "Active" ? (
                                  <RxDotFilled
                                    style={{
                                      fontSize: "20px",
                                      color: "#30a04b",
                                    }}
                                  />
                                ) : (
                                  data.lastActive
                                )}
                              </p>
                              {parseInt(data.countMessseen) > 0 &&
                                data.lastSend !== userData._id && (
                                  <div
                                    className="wrap-count-seen"
                                    style={{ display: "block !important" }}
                                  >
                                    <p className="count-seen">
                                      {parseInt(data.countMessseen)}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default memo(Contact);
