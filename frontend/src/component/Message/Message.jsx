import React, { useContext, useRef, useState } from "react";
import { ContactContext } from "../../Context/ContactConext";
import MessageInfor from "./MessageInfor";
import Contact from "./Contact";
import WellCome from "./WellCome";
import ContainerMess from "./ContainerMess";
import { UserContext } from "../../Context/UserContext";
import { getConversationByIdFriend, getFriendById } from "../../util/api";

export default function Message({ showPageAddressBook }) {
  const [dataContact, setDataContact] = useState(null);
  const { socket } = useContext(UserContext);

  const handleChangeSoftContact = (value) => {
    setDataContact(value);
  };

  const handleChangeContact = async (value) => {
    try {
      if (value.idConversation === null || value.idConversation === undefined) {
        const response = await getConversationByIdFriend({
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

          const response = await getFriendById({
            friendId: data.friendId,
          });
          if (response.status === 200) {
            setDataContact({ ...response.data, idChatWith: response.data._id });
          }
        }
      } else {
        setDataContact(value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisableContainer = () => {
    console.log("ceh");
    setDataContact(null);
  };
  return (
    <>
      <div className="container-mess flex">
        <div>
          <Contact
            handleChangeSoftContact={handleChangeSoftContact}
            handleChangeContact={handleChangeContact}
            showPageAddressBook={showPageAddressBook}
            disableContainer={handleDisableContainer}
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
