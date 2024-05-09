import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState([]);
  const { userData, socket } = useContext(UserContext);

  useEffect(() => {
    fetchConversation();
  }, [userData]);

  const fetchConversation = async () => {
    if (userData) {
      const response = await axios.post(
        "http://localhost:8080/conversation/getallconversationbyuser",
        { id: userData._id }
      );
      setContact(response.data);
      const listID = response.data.map((item) => item.idChatWith);
      socket.current.emit("add-user", { id: userData._id, listFriend: listID });
    }
  };

  return (
    <ContactContext.Provider value={{ contact, setContact, fetchConversation }}>
      {children}
    </ContactContext.Provider>
  );
};
