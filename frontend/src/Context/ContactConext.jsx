import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.post("http://127.0.0.1:8080/user/getfriend");
      if (response.status === 200) {
        setContact(response.data);
      }
    };
    fetch();
  }, []);

  return (
    <ContactContext.Provider value={{ contact }}>
      {children}
    </ContactContext.Provider>
  );
};
