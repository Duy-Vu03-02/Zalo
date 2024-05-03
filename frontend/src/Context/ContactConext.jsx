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
        // const response = await axios.post(
        //   "http://localhost:8080/user/getallfriend",
        //   { id: userData._id }
        // );
        // if (response.status === 200) {
        //   setContact(response.data);
        //   console.log(response.data);
        // }
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
