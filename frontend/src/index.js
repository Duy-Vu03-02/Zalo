import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./Context/ThemeContext";
import { UserProvider } from "./Context/UserContext";
import { ContactProvider } from "./Context/ContactConext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider>
        <ContactProvider>
          <App />
        </ContactProvider>
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);
