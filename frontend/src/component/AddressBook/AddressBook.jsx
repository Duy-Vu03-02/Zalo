import React, { useContext, useRef, useState } from "react";
import { ContactContext } from "../../Context/ContactConext";
import { UserContext } from "../../Context/UserContext";
import MessageInfor from "../Message/MessageInfor";
import ContainerMess from "../Message/ContainerMess";
import axios from "axios";
import MenuContact from "./MenuContact";
import ContentMenuContact from "./ContentMenuContact";
import { useEffect } from "react";

export default function AddressBook() {
  const [dataContact, setDataContact] = useState(null);
  const [showContentMenuContact, setShowContentMenuContact] = useState({
    state: false,
    data: null,
    title: null,
    count: null,
  });
  const { socket, userData } = useContext(UserContext);
  const handleChangeSoftContact = (value) => {
    setDataContact(value);
    setShowContentMenuContact({
      state: false,
      data: null,
      title: null,
      count: null,
    });
  };

  const handleChangeContact = async (value) => {
    try {
      if (value.idConversation === null || value.idConversation === undefined) {
        const url =
          "http://localhost:8080/conversation/getconversationbyfriendid";
        const response = await axios.post(url, {
          userId: userData._id,
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
          setShowContentMenuContact({
            state: false,
            data: null,
            title: null,
            count: null,
          });
          return;
        }
        if (response.status === 204) {
          const data = {
            userId: value.userId,
            friendId: value._id,
          };

          const url = "http://localhost:8080/user/getfriendbyid";
          const response = await axios.post(url, { friendId: data.friendId });
          if (response.status === 200) {
            setDataContact({ ...response.data, idChatWith: response.data._id });
          }
        }
      } else {
        setDataContact(value);
        setShowContentMenuContact({
          state: false,
          data: null,
          title: null,
          count: null,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetContentMenuContact = (value) => {
    setShowContentMenuContact(value);
  };

  const handleShowSoftConversation = (conversation) => {
    handleChangeContact(conversation);
    setShowContentMenuContact({
      state: false,
      data: null,
      title: null,
      count: null,
    });
  };

  return (
    <>
      <div className="container-mess flex">
        <div>
          <MenuContact
            // Mo conversation
            handleChangeContact={handleChangeContact}
            // Mo conversation da co tn
            handleChangeSoftContact={handleChangeSoftContact}
            // Mo content cua menu contact AddressBook
            handleSetContentMenuContact={handleSetContentMenuContact}
          />
        </div>

        <div className="fetch-menu-contact">
          {showContentMenuContact.state && (
            <ContentMenuContact
              dataContentContac={showContentMenuContact?.data}
              title={showContentMenuContact?.title}
              count={showContentMenuContact?.count}
              handleShowSoftConversation={handleShowSoftConversation}
            />
          )}
        </div>

        <div>
          {dataContact !== null && <ContainerMess contactData={dataContact} />}
        </div>
        <div>
          {dataContact !== null && <MessageInfor contactData={dataContact} />}
        </div>
      </div>
    </>
  );
}
