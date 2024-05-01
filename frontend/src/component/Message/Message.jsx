import React, { useContext, useRef, useState } from "react";
import { ContactContext } from "../../Context/ContactConext";
import MessageInfor from "./MessageInfor";
import Contact from "./Contact";
import ContainerMess from "./ContainerMess";

export default function Message({ socket }) {
  const [dataContact, setDataContact] = useState(null);

  const handleChangeContact = (value) => {
    setDataContact(value);
  };
  return (
    <>
      <div className="container-mess flex">
        <div>
          <Contact handleChangeContact={handleChangeContact} />
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
            <MessageInfor contactData={dataContact} socket={socket} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
