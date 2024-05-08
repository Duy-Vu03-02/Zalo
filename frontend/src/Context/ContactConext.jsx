import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    fetchConversation();
  }, [userData]);

  const fetchConversation = async () => {
    if (userData) {
      const response = await axios.post(
        "http://localhost:8080/conversation/getallconversationbyuser",
        { id: userData._id }
      );
      console.log(response.data);
      setContact(response.data);
    }
  };

  return (
    <ContactContext.Provider value={{ contact, setContact, fetchConversation }}>
      {children}
    </ContactContext.Provider>
  );
};
