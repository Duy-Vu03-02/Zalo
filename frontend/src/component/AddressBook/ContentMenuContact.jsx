import React, { useContext, useEffect, useState } from "react";
import "../../resource/style/AddressBook/contentMenuContact.css";
import { LoiMoiKetBan, LoiMoiVaoNhom } from "./MenuContact";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";

export default function ({ data, title, count, handleShowSoftConversation }) {
  const { userData } = useContext(UserContext);
  const [friendReq, setFriendReq] = useState([]);

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
  console.log(data.length);
  return (
    <>
      <div className="waper-content-menu-contact">
        <div className="header-content-menu-contact flex">
          <h3>{title}</h3>
        </div>
        <div className="list-fetch-contact">
          <div className="total-fetch">{count}</div>
          <div className="content-fetch-contact">
            {data && (
              <div>
                <input type="text" placeholder="Tìm kiếm" />
              </div>
            )}
            {
              <ul
                style={{
                  display: !data ? "flex" : undefined,
                  justifyContent: !data ? "center" : undefined,
                  alignItems: !data ? "center" : undefined,
                }}
              >
                {data?.length > 0 ? (
                  data?.map((item, index) => (
                    <li
                      key={index}
                      className="flex"
                      onClick={() =>
                        handleShowSoftConversation({
                          ...item,
                          idChatWidth: item._id,
                        })
                      }
                    >
                      <div className="item-fetch flex">
                        <img
                          src={item.avatar}
                          alt={`avatar by ${item.username}`}
                        />
                        <p>{item.username}</p>
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
        {friendReq?.length > 0 && (
          <div className="friend-req">
            <ul className="flex">
              {friendReq.map((item, index) => (
                <li key={index}>
                  <div className="item-fetch flex">
                    <img src={item.avatar} alt="" />
                    <p>{item.username}</p>
                  </div>
                  <div>
                    <button>Thu hồi lời mời</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
