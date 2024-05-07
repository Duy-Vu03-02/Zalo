import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetch = async () => {
      if (userData) {
        const response = await axios.post(
          "http://localhost:8080/message/getallmessage",
          { id: userData._id }
        );
        setContact(response.data);
      }
    };
    fetch();
  }, [userData]);

  return (
    <ContactContext.Provider value={{ contact, setContact }}>
      {children}
    </ContactContext.Provider>
  );
};
