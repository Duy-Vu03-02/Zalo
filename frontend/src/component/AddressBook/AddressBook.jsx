import React, { useContext, useRef, useState } from "react";
import { ContactContext } from "../../Context/ContactConext";
import { UserContext } from "../../Context/UserContext";
import MessageInfor from "../Message/MessageInfor";
import ContainerMess from "../Message/ContainerMess";
import axios from "axios";
import MenuContact from "./MenuContact";

export default function AddressBook() {
  const [dataContact, setDataContact] = useState(null);
  const { socket } = useContext(UserContext);
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
          console.log(data);
          socket.current.emit("create-new-conversation", data);
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
          <MenuContact handleChangeContact={handleChangeContact} />
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
