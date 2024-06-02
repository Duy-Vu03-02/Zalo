import React, { useContext, useEffect, useState, useRef } from "react";
import "../../resource/style/AddressBook/contentMenuContact.css";
import {
  LoiMoiKetBan,
  LoiMoiVaoNhom,
  DanhSachBanBe,
  DanhSachNhom,
} from "./MenuContact";
import { UserContext } from "../../Context/UserContext";
import { TbMessageDots } from "react-icons/tb";
import axios from "axios";

export const HUY_LOI_MOI_KET_BAN = "Thu hồi lời mời";
export const KET_BAN = "Kết bạn";
export const DONG_Y = "Đồng ý";
export const BAN_BE = "Bạn bè";
export const XOA_BAN_BE = "Xóa bạn bè";
export const BO_QUA = "Bỏ qua";
export const ACTIVE = "Active";

export default function ({
  dataContentContac,
  title,
  count,
  handleShowSoftConversation,
}) {
  const { userData, socket } = useContext(UserContext);
  const [currentContact, setCurrentContact] = useState(null);
  const [friendReq, setFriendReq] = useState([]);
  const contant = {
    XoaKetBan: false,
    ThuHoiLoiMoi: false,
    DongY: false,
    KetBan: false,
    BoQua: false,
    BanBe: false,
    XoaBanBe: false,
  };

  const [listData, setListData] = useState(new Map([]));

  useEffect(() => {
    if (dataContentContac && dataContentContac.length > 0) {
      if (title === DanhSachBanBe) {
        setListData(() => {
          const mapConact = new Map();
          dataContentContac?.map((item) => {
            const state = {
              ...item,
              ...contant,
              XoaBanBe: true,
              BanBe: true,
            };
            mapConact.set(item._id, state);
          });
          return mapConact;
        });
      } else if (title === LoiMoiKetBan) {
        setListData(() => {
          const mapContact = new Map();
          dataContentContac?.map((item) => {
            const state = {
              ...item,
              ...contant,
              DongY: true,
              BoQua: true,
            };
            mapContact.set(item._id, state);
          });
          return mapContact;
        });
      } else {
        setListData(new Map([]));
      }
    }
    setCurrentContact(null);
  }, [title]);

  useEffect(() => {
    const fetch = async () => {
      // Neu la loi moi ket ban thi call ca friend req
      if (title === LoiMoiKetBan) {
        const url = "http://localhost:8080/user/getfriendreq";
        const response = await axios.post(url, { id: userData._id });
        if (response.status === 200) {
          if (response.data.length > 0) {
            setFriendReq(response.data);
          }
        }
      }
    };
    fetch();
  }, [title]);

  useEffect(() => {
    if (currentContact) {
      socket.current.on("recieve-crud-fr", (data) => {
        if (data.mess === KET_BAN) {
          let temp = listData.get(currentContact);

          const newListData = listData.set(currentContact, {
            ...temp,
            ...contant,
            KetBan: true,
          });
          setListData(new Map(newListData));
        }
        if (data.mess === HUY_LOI_MOI_KET_BAN) {
          let temp = listData.get(currentContact);

          const newListData = listData.set(currentContact, {
            ...temp,
            ...contant,
            ThuHoiLoiMoi: true,
          });
          setListData(new Map(newListData));
        }
        if (data.mess === DONG_Y) {
          let temp = listData.get(currentContact);

          const newListData = listData.set(currentContact, {
            ...temp,
            ...contant,
            DongY: true,
          });
          setListData(new Map(newListData));
        }
        if (data.mess === BO_QUA) {
          let temp = listData.get(currentContact);

          const newListData = listData.set(currentContact, {
            ...temp,
            ...contant,
            BoQua: true,
          });
          setListData(new Map(newListData));
        }
        if (data.mess === BAN_BE) {
          let temp = listData.get(currentContact);

          const newListData = listData.set(currentContact, {
            ...temp,
            ...contant,
            BanBe: true,
            XoaBanBe: true,
          });
          setListData(new Map(newListData));
        }
      });
    }

    if (socket.current) {
      return () => {
        socket.current.off("recieve-crud-fr");
      };
    }
  }, [currentContact]);

  const handleCrudFriend = async (friend, e, key) => {
    setCurrentContact(key);
    const data = {
      userId: userData._id,
      friendId: friend._id,
      state: e.target.textContent,
    };
    const url = "http://localhost:8080/user/crudfriend";
    const response = await axios.post(url, data);
    if (response.status === 200) {
      if (data.state === HUY_LOI_MOI_KET_BAN && title === LoiMoiKetBan) {
        setFriendReq((prevFriendReq) => {
          const newFriendReq = prevFriendReq.filter(
            (item) => item._id !== friend._id
          );
          return newFriendReq;
        });
        return;
      } else {
        socket.current.emit("crud-friend", data);
      }
    }
  };

  return (
    <>
      {listData && (
        <div className="waper-content-menu-contact">
          <div className="header-content-menu-contact flex">
            <h3>{title}</h3>
          </div>
          <div className="list-fetch-contact">
            <div className="total-fetch">{count}</div>
            <div className="content-fetch-contact">
              {listData?.size > 0 && (
                <div>
                  <input type="text" placeholder="Tìm kiếm" />
                </div>
              )}
              {
                <ul
                  style={{
                    display: listData.size === 0 ? "flex" : undefined,
                    justifyContent: listData.size === 0 ? "center" : undefined,
                    alignItems: listData.size === 0 ? "center" : undefined,
                  }}
                >
                  {listData.size > 0 ? (
                    Array.from(listData).map(([key, item], index) => (
                      <li
                        key={index}
                        style={{ justifyContent: "space-between" }}
                        className="flex"
                      >
                        <div
                          className="item-fetch flex"
                          onClick={() =>
                            handleShowSoftConversation({
                              ...item,
                              idChatWidth: item._id,
                            })
                          }
                        >
                          <img
                            src={item.avatar}
                            alt={`avatar by ${item.username}`}
                          />
                          <p>{item.username}</p>
                        </div>
                        <div
                          className="btn-state-contact"
                          style={{ display: "none" }}
                        >
                          {item.BanBe && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {XOA_BAN_BE}
                            </button>
                          )}
                          {item.BanBe && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {BAN_BE}
                            </button>
                          )}
                          {item.KetBan && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {KET_BAN}
                            </button>
                          )}
                          {item.DongY && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {BO_QUA}
                            </button>
                          )}
                          {item.DongY && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {DONG_Y}
                            </button>
                          )}
                          {item.ThuHoiLoiMoi && (
                            <button
                              onClick={(e) => handleCrudFriend(item, e, key)}
                            >
                              {HUY_LOI_MOI_KET_BAN}
                            </button>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <div>
                      <img
                        src="https://chat.zalo.me/assets/invitation-emptystate.248ad1da229565685f19d3d527985812.png"
                        alt=""
                      />
                      <p style={{ padding: "10px", color: "#7589a3" }}>
                        Không có dữ liệu
                      </p>
                    </div>
                  )}
                </ul>
              }
            </div>
          </div>
          {friendReq?.length > 0 && title === LoiMoiKetBan && (
            <div>
              <div className="list-fetch-contact">
                <div className="total-fetch">
                  Lời mời đã gửi ({friendReq?.length})
                </div>
              </div>
              <div className="friend-req">
                <ul className="flex">
                  {friendReq.map((item, index) => (
                    <li key={index}>
                      <div
                        className="flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="item-fetch flex">
                          <img src={item.avatar} alt="" />
                          <p>{item.username}</p>
                        </div>
                        <div
                          className="btn-soft-mess"
                          onClick={() =>
                            handleShowSoftConversation({
                              ...item,
                              idChatWidth: item._id,
                            })
                          }
                        >
                          <TbMessageDots />
                        </div>
                      </div>
                      <div>
                        <button onClick={(e) => handleCrudFriend(item, e)}>
                          Thu hồi lời mời
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
