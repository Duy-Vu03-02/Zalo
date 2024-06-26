import { createContext, useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import { getAllConversation } from "../util/api";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const fetchContact = useRef(null);
  const [contact, setContact] = useState([]);
  const [currentConversation, setCurrentConversation] = useState("");

  const { userData, socket } = useContext(UserContext);

  useEffect(() => {
    fetchConversation();
  }, [userData]);

  useEffect(() => {
    const fetch = async () => {
      if (fetchContact.current) {
        clearTimeout(fetchContact.current);
      }
      fetchContact.current = setTimeout(() => {
        fetchConversation();
      }, 30000);
    };
    fetch();
  }, []);

  const fetchConversation = async () => {
    if (userData) {
      const response = await getAllConversation({ id: userData._id });
      setContact(response.data);

      // if (response.data && response.data.length > 0) {
      //   const listID = response.data.map((item) => item.idChatWith);
      //   socket.current.emit("add-user", {
      //     id: userData._id,
      //     listFriend: listID,
      //   });
      // } else {
      //   socket.current.emit("add-user", { id: userData._id });
      // }
    }
  };

  return (
    <ContactContext.Provider
      value={{
        contact,
        setContact,
        fetchConversation,
        currentConversation,
        setCurrentConversation,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
