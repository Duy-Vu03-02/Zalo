import React, { useContext, useRef, useState } from "react";
import { ContactContext } from "../../Context/ContactConext";
import MessageInfor from "./MessageInfor";
import Contact from "./Contact";
import WellCome from "./WellCome";
import ContainerMess from "./ContainerMess";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

export default function Message({ showPageAddressBook }) {
  const [dataContact, setDataContact] = useState(null);
  const { socket } = useContext(UserContext);

  const handleChangeSoftContact = (value) => {
    setDataContact(value);
  };

  const handleChangeContact = async (value) => {
    try {
      if (value.idConversation === null || value.idConversation === undefined) {
        const url =
          "http://localhost:8080/conversation/getconversationbyfriendid";
        const response = await axios.post(url, {
          userId: value.userId,
          friendId: value._id,
        });
        if (response.status === 200) {
          delete value.userId;
          delete value._id;

          const resData = response.data;
          const format = {
            ...resData,
            ...value,
          };
          setDataContact(format);
          return;
        }
        if (response.status === 204) {
          const data = {
            userId: value.userId,
            friendId: value._id,
          };

          socket.current.emit("create-soft-conversation", {
            friendId: data.friendId,
          });
        }
      } else {
        setDataContact(value);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="container-mess flex">
        <div>
          <Contact
            handleChangeSoftContact={handleChangeSoftContact}
            handleChangeContact={handleChangeContact}
            showPageAddressBook={showPageAddressBook}
          />
        </div>
        <div>
          {dataContact !== null ? (
            <ContainerMess contactData={dataContact} />
          ) : (
            ""
          )}
        </div>
        <div>
          {dataContact !== null ? (
            <MessageInfor contactData={dataContact} />
          ) : (
            ""
            // <WellCome />
          )}
        </div>
      </div>
    </>
  );
}
