import { createContext, useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const fetchContact = useRef(null);
  const [contact, setContact] = useState([]);
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
      }, 60000);
    };
    fetch();
  });

  const fetchConversation = async () => {
    if (userData) {
      const response = await axios.post(
        "http://localhost:8080/conversation/getallconversationbyuser",
        { id: userData._id }
      );
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
    <ContactContext.Provider value={{ contact, setContact, fetchConversation }}>
      {children}
    </ContactContext.Provider>
  );
};
