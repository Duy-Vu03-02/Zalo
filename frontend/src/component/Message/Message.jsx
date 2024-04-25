import React from "react";
import MessageInfor from "./MessageInfor";
import Contact from "./Contact";
import ContainerMess from "./ContainerMess";

export default function Message() {
  return (
    <>
      <div className="container-mess flex">
        <div>
          <Contact />
        </div>
        <div>
          <ContainerMess />
        </div>
        <div>
          <MessageInfor />
        </div>
      </div>
    </>
  );
}
